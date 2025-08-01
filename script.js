const form = document.getElementById("evaluationForm");
const resultBox = document.getElementById("resultBox");
const scoreSpan = document.getElementById("scoreValue");
const feedbackText = document.getElementById("feedbackText");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const ctx = document.getElementById("evaluationChart").getContext("2d");

if (window.chartInstance) {
  window.chartInstance.destroy(); // remove previous chart if exists
}

window.chartInstance = new Chart(ctx, {
  type: "radar",
  data: {
    labels: ["Problem", "Solution", "Audience", "Market", "Revenue", "Team"],
    datasets: [{
      label: "Startup Score Breakdown",
      data: [
        data.get("problem").length > 20 ? 20 : 5,
        data.get("solution").length > 20 ? 20 : 5,
        data.get("audience") ? 10 : 2,
        data.get("marketSize") === "Large" ? 15 : 5,
        data.get("revenue") ? 10 : 2,
        parseInt(data.get("experience")) >= 3 ? 25 : 5,
      ],
      backgroundColor: "rgba(13, 110, 253, 0.4)",
      borderColor: "#0dcaf0",
      borderWidth: 2,
      pointBackgroundColor: "#fff"
    }]
  },
  options: {
    responsive: true,
    scales: {
      r: {
        pointLabels: {
          color: "#ffffff",
          font: {
            size: 14
          }
        },
        angleLines: { color: "#444" },
        grid: { color: "#333" },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { labels: { color: "#fff" } }
    }
  }
});

  const data = new FormData(form);
  let score = 0;

  // Simple scoring logic (out of 100)
  if (data.get("problem").length > 20) score += 20;
  if (data.get("solution").length > 20) score += 20;
  if (data.get("audience")) score += 10;
  if (data.get("marketSize") === "Large") score += 15;
  if (data.get("revenue")) score += 10;
  if (parseInt(data.get("experience")) >= 3) score += 25;

  scoreSpan.textContent = score;

  // Set feedback and color based on score
  resultBox.classList.remove("d-none", "low-score", "medium-score", "high-score");
  if (score >= 80) {
    resultBox.classList.add("high-score");
    feedbackText.textContent = "🔥 Great potential! Investors would be interested.";
  } else if (score >= 50) {
    resultBox.classList.add("medium-score");
    feedbackText.textContent = "🧪 Decent idea. Could be stronger with a better team or market plan.";
  } else {
    resultBox.classList.add("low-score");
    feedbackText.textContent = "⚠️ Needs refinement. Try strengthening your problem and solution.";
  }
});
document.getElementById("aiSuggestBtn").addEventListener("click", async () => {
  const data = new FormData(document.getElementById("startupForm"));
  const prompt = `A user submitted the following startup idea:
- Problem: ${data.get("problem")}
- Solution: ${data.get("solution")}
- Target Audience: ${data.get("audience")}
- Market Size: ${data.get("marketSize")}
- Revenue Model: ${data.get("revenue")}
- Team Experience: ${data.get("experience")} years

Give 3 personalized suggestions to improve this startup.`;

  document.getElementById("aiSuggestions").innerHTML = "<em>Generating suggestions...</em>";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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" // 🔒 Replace with your real key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const result = await response.json();
    const aiText = result.choices[0].message.content;
    document.getElementById("aiSuggestions").innerHTML = `<pre>${aiText}</pre>`;
  } catch (error) {
    document.getElementById("aiSuggestions").innerHTML = "❌ Error fetching AI suggestions.";
    console.error(error);
  }
});
