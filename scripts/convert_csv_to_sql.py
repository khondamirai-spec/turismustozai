import csv
import json

def process_csv(file_path):
    sql_statements = ["TRUNCATE TABLE turism_questions_v2;"]
    
    with open(file_path, mode='r', encoding='utf-8') as csvfile:
        # Check first line for BOM or weirdness
        content = csvfile.read()
        if content.startswith('\ufeff'):
            content = content[1:]
        csvfile.seek(0)
        
        reader = csv.DictReader(csvfile)
        for row in reader:
            theme = row['mavzu'].strip().replace("'", "''")
            question = row['test'].strip().replace("'", "''")
            question_text = row['test_text'].strip().replace("'", "''")
            option_text = row['variant_text'].strip().replace("'", "''")
            option_pic = row['variant_rasm'].strip().replace("'", "''")
            correct_answer = row['togri_javob'].strip().upper() == 'TRUE'
            
            sql = f"INSERT INTO turism_questions_v2 (theme, question, question_text, option_text, option_pic, correct_answer) VALUES ('{theme}', '{question}', '{question_text}', '{option_text}', '{option_pic}', {str(correct_answer).lower()});"
            sql_statements.append(sql)
            
    return "\n".join(sql_statements)

if __name__ == "__main__":
    file_path = r'c:\Users\DELL\Desktop\turism\test - Лист1.csv'
    sql = process_csv(file_path)
    with open('scripts/turism_import.sql', 'w', encoding='utf-8') as f:
        f.write(sql)
    print("SQL written to scripts/turism_import.sql")
