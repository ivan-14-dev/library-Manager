from django.test import TestCase
from .models import User
from rest_framework.test import APITestCase

# Create your tests here.
class UserTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User',
            role=User.Role.STUDENT,
            phone='1234567890',
            address='123 Test St',
            date_of_birth='2000-01-01',
            student_id='S123456',
            department='Computer Science'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertEqual(self.user.first_name, 'Test')
        self.assertEqual(self.user.last_name, 'User')
        self.assertEqual(self.user.role, User.Role.STUDENT)
        self.assertEqual(self.user.phone, '1234567890')
        self.assertEqual(self.user.address, '123 Test St')
        self.assertEqual(self.user.date_of_birth, '2000-01-01')
        self.assertEqual(self.user.student_id, 'S123456')
        self.assertEqual(self.user.department, 'Computer Science')