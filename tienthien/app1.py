from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# 🔑 API KEY Gemini
genai.configure(api_key="AIzaSyDM-70P1GjW2HYUDEnq3U71kYs4zSyH9Uc")

model = genai.GenerativeModel("gemini-3-flash-preview")

# 🔹 Logic đơn giản (rule-based)
def analyze_user(data):
    result = []

    # Convert to lowercase để normalize "Có", "có", "yes", "OK", etc
    cold = str(data.get("cold", "")).lower()
    hot = str(data.get("hot", "")).lower()
    tired = str(data.get("tired", "")).lower()

    if "có" in cold or "yes" in cold or "y" in cold:
        result.append("Dương hư (thiên về lạnh)")
    if "có" in hot or "yes" in hot or "y" in hot:
        result.append("Nhiệt")
    if "có" in tired or "yes" in tired or "y" in tired or "mệt" in tired:
        result.append("Khí hư")

    if not result:
        result.append("Cân bằng")

    return ", ".join(result)


@app.route("/")
def home():
    return render_template("tienthien.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "Không có dữ liệu"}), 400

        constitution = analyze_user(data)

        # 🧠 Prompt cho Gemini
        prompt = f"""Bạn là chuyên gia Đông y.

Đây KHÔNG phải chuẩn đoán bệnh.

Thông tin:
- Thể chất: {constitution}
- Ngày sinh: {data.get("dob")}
- Tính cách: {data.get("personality")}
- Hay lạnh: {data.get("cold")}
- Hay nóng: {data.get("hot")}
- Hay mệt: {data.get("tired")}
- Mong muốn: {data.get("request")}

Hãy trả về lời khuyên ngắn gọn:
1. Tổng quan thể chất
2. Lời khuyên ăn uống
3. Lối sống hợp lý

Viết dễ hiểu, không quá dài."""

        response = model.generate_content(prompt)

        # Loại bỏ Markdown nếu mô hình vẫn trả về ký tự markdown
        clean_text = response.text.replace("**", "").replace("##", "").strip()

        return jsonify({
            "constitution": constitution,
            "advice": clean_text
        })
    
    except Exception as e:
        import traceback
        print("ERROR:", str(e))
        print(traceback.format_exc())
        return jsonify({
            "error": str(e),
            "constitution": "Lỗi phân tích",
            "advice": f"Chi tiết lỗi: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(debug=True)