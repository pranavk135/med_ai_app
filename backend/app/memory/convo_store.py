memory = {}

def get_history(user_id):
    return memory.get(user_id, [])

def add_message(user_id, role, content):
    if user_id not in memory:
        memory[user_id] = []
    memory[user_id].append({"role": role, "content": content})

def clear_history(user_id):
    memory.pop(user_id, None)