from flask import Flask, request, jsonify, render_template
from google import genai

app = Flask(__name__)

client = genai.Client(api_key="AIzaSyA_fvN1c2dctZBiijvSb-ggkiyVBtGlk3E")

chat_history = []

SYSTEM_PROMPT = """
Bạn là chuyên gia Đông y.

YÊU CẦU:
- Trả lời tối đa 3-4 câu
- Câu ngắn, rõ, không lan man

FORMAT HTML:
Thể trạng:...
Nguyên nhân:...
Đề xuẩt ăn uống:...
Gợi ý:...

Nếu CHƯA đủ thông tin:
→ chỉ hỏi 1 câu ngắn (KHÔNG phân tích)

Không viết ngoài format.
"""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message")

    print("USER:", user_msg)

    # lưu lịch sử
    chat_history.append(f"User: {user_msg}")

    # 👇 GHÉP SYSTEM PROMPT + HISTORY
    full_prompt = SYSTEM_PROMPT + "\n" + "\n".join(chat_history)

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=full_prompt
        )

        # lấy text chắc chắn
        if hasattr(response, "text") and response.text:
            reply = response.text
        else:
            reply = "Không có phản hồi"

    except Exception as e:
        reply = f"Lỗi: {str(e)}"

    print("AI:", reply)

    # lưu lại phản hồi
    chat_history.append(f"AI: {reply}")

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)