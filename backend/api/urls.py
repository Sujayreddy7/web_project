from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import NoteViewSet, TaskViewSet, DailyGoalViewSet, StudyPlanViewSet
from .views import SummarizeNoteView, AskQuestionView, GenerateStudyPlanView, RegisterView

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'goals', DailyGoalViewSet, basename='goal')
router.register(r'study-plans', StudyPlanViewSet, basename='studyplan')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    
    # Generic Model endpoints
    path('', include(router.urls)),
    
    # AI Custom endpoints
    path('status/', StatusView.as_view(), name='status'),
    path('ai/summarize/', SummarizeNoteView.as_view(), name='ai-summarize'),
    path('ai/ask/', AskQuestionView.as_view(), name='ai-ask'),
    path('ai/plan/', GenerateStudyPlanView.as_view(), name='ai-plan'),
]
