import re

def check_complexity(password):
    if not password:
        return {
            'isValid': False,
            'checks': {
                'length': False,
                'uppercase': False,
                'lowercase': False,
                'number': False,
                'special': False
            }
        }
    
    checks = {
        'length': 14 <= len(password) <= 16,
        'uppercase': any(c.isupper() for c in password),
        'lowercase': any(c.islower() for c in password),
        'number': any(c.isdigit() for c in password),
        'special': bool(re.search(r'[!@#$%^&*()\-=_+]', password))
    }
    
    return {
        'isValid': all(checks.values()),
        'checks': checks
    }
