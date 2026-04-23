import os
import openai

def get_changed_files():
    # Simulate fetching changed files (replace with actual implementation)
    return ["src/App.jsx", "src/components/Navbar/Navbar.jsx"]

def review_code(file_path):
    with open(file_path, 'r') as file:
        code = file.read()

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a code reviewer. Provide constructive feedback."},
            {"role": "user", "content": f"Review the following code:\n{code}"}
        ]
    )

    return response['choices'][0]['message']['content']

def main():
    openai.api_key = os.getenv("OPENAI_API_KEY")

    changed_files = get_changed_files()
    for file_path in changed_files:
        print(f"Reviewing {file_path}...")
        feedback = review_code(file_path)
        print(f"Feedback for {file_path}:\n{feedback}\n")

if __name__ == "__main__":
    main()