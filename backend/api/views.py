import os
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import summarize_note_content, answer_question_from_notes, generate_study_plan
from .models import Note, Task, StudyPlan, DailyGoal
from .serializers import NoteSerializer, TaskSerializer, StudyPlanSerializer, DailyGoalSerializer, UserSerializer
from django.contrib.auth.models import User

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

class BaseUserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at' if hasattr(self.queryset.model, 'created_at') else '-id')

class NoteViewSet(BaseUserViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class TaskViewSet(BaseUserViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class DailyGoalViewSet(BaseUserViewSet):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer

class StudyPlanViewSet(BaseUserViewSet):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer

class StatusView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        model_name = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
        return Response({
            "status": "online",
            "version": "2.1-robust-fallback",
            "configured_model": model_name
        })

class SummarizeNoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        content = request.data.get("content")
        note_id = request.data.get("note_id")
        note_instance = None
        print(f"DEBUG: SummarizeNoteView called with content length {len(content) if content else 0}, note_id={note_id}")
        if note_id:
            try:
                note_instance = Note.objects.get(id=note_id, user=request.user)
                content = note_instance.content
            except Note.DoesNotExist:
                return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
        if not content:
            return Response({"error": "Content or note_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            summary = summarize_note_content(content)
            if note_instance:
                note_instance.summary = summary
                note_instance.save()
            return Response({"summary": summary})
        except PermissionError as perm_err:
            print(f"DEBUG ERROR: PermissionError in SummarizeNoteView: {perm_err}")
            return Response({"error": "Invalid or revoked Gemini API key"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            print(f"DEBUG ERROR: Exception in SummarizeNoteView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AskQuestionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        content = request.data.get("content")
        question = request.data.get("question")
        print(f"DEBUG: AskQuestionView called with content length {len(content) if content else 0}, question='{question}'")
        if not content or not question:
            return Response({"error": "Both content and question are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            answer = answer_question_from_notes(content, question)
            return Response({"answer": answer})
        except PermissionError as perm_err:
            print(f"DEBUG ERROR: PermissionError in AskQuestionView: {perm_err}")
            return Response({"error": "Invalid or revoked Gemini API key"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            print(f"DEBUG ERROR: Exception in AskQuestionView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateStudyPlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subjects = request.data.get("subjects")
        deadline = request.data.get("deadline")
        print(f"DEBUG: GenerateStudyPlanView called with subjects={subjects}, deadline={deadline}")
        if not subjects or not deadline:
            return Response({"error": "Subjects and deadline are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            plan = generate_study_plan(subjects, deadline)
            return Response({"plan": plan})
        except PermissionError as perm_err:
            print(f"DEBUG ERROR: PermissionError in GenerateStudyPlanView: {perm_err}")
            return Response({"error": "Invalid or revoked Gemini API key"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            print(f"DEBUG ERROR: Exception in GenerateStudyPlanView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
