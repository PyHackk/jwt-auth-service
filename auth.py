from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User, db
import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    return True, "Password is valid"

def validate_registration_data(data):
    """Validate user registration data"""
    errors = []
    
    # Required fields
    required_fields = ['email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if not data.get(field):
            errors.append(f"{field} is required")
    
    # Email validation
    if data.get('email') and not validate_email(data['email']):
        errors.append("Invalid email format")
    
    # Password validation
    if data.get('password'):
        is_valid, message = validate_password(data['password'])
        if not is_valid:
            errors.append(message)
    
    # Name length validation
    if data.get('first_name') and len(data['first_name']) < 2:
        errors.append("First name must be at least 2 characters")
    
    if data.get('last_name') and len(data['last_name']) < 2:
        errors.append("Last name must be at least 2 characters")
    
    return errors

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def active_user_required(f):
    """Decorator to require active user"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 403
        
        return f(*args, **kwargs)
    return decorated_function
