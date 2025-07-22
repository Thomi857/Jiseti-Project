from flask_jwt_extended import get_jwt_identity
from models import User
import logging

def is_admin(user_id=None):
    """Check if user is admin"""
    if user_id is None:
        user_id = get_jwt_identity()
    
    if not user_id:
        return False
    
    user = User.find_by_id(user_id)
    return user and user.get('is_admin', False)

def can_edit_report(report, user_id):
    """Check if user can edit report"""
    if not report or not user_id:
        return False
    
    # Owner can edit if status is draft
    if report['user_id'] == user_id and report['status'] == 'draft':
        return True
    
    # Admin can always edit
    return is_admin(user_id)

def can_delete_report(report, user_id):
    """Check if user can delete report"""
    if not report or not user_id:
        return False
    
    # Only owner can delete and only if status is draft
    return report['user_id'] == user_id and report['status'] == 'draft'

def can_update_status(user_id):
    """Check if user can update report status"""
    return is_admin(user_id)