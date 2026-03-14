import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🏎️ ユーザーには即座に成功を返す
    const response = NextResponse.json({ success: true });

    // 🕵️ バックグラウンド処理
    (async () => {
      try {
        const targetEmail = process.env.CONTACT_EMAIL || 'corelinks.info.contact@gmail.com';
        let aiReport = "";

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `あなたはCORE LINKS STUDIOのシニアディレクターです。
        以下の問い合わせを査定し、必ずこの形式で出力してください。
        
        ■スコア: (0-100の数値)
        ■判定: (通過/要注意/拒絶)
        ■要約: (結論を1行で)
        ■理由: (箇条書き)
        ■アドバイス: (運営への指示)
        ---
        名前: ${body.name} / 予算: ${body.budget} / 内容: ${body.detail}`;

        const result = await model.generateContent(prompt);
        aiReport = (await result.response).text();

        // テキストから情報を抽出するユーティリティ
        const extract = (key: string) => {
          const reg = new RegExp(`■${key}[:：]?\\s*([\\s\\S]*?)(?=\\n■|$)`);
          return aiReport.match(reg)?.[1]?.trim() || "---";
        };

        const score = extract("スコア");
        const decision = extract("判定");
        const summary = extract("要約");
        const reason = extract("理由");
        const advice = extract("アドバイス");

        // デザイン用の色設定
        const isPass = decision.includes("通過");
        const isWarning = decision.includes("要注意");
        const statusColor = isPass ? "#10b981" : (isWarning ? "#f59e0b" : "#ef4444");
        const statusLabel = isPass ? "PASS" : (isWarning ? "HOLD" : "REJECT");

        // 📧 メール送信（超美麗デザイン）
        await resend.emails.send({
          from: 'Gatekeeper <onboarding@resend.dev>',
          to: targetEmail,
          subject: `【査定報告】${statusLabel} / ${body.name}様`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                
                <div style="background-color: ${statusColor}; padding: 40px 20px; text-align: center; color: white;">
                  <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin: 0 0 10px 0; font-weight: bold; opacity: 0.8;">AI Assessment Report</p>
                  <h1 style="font-size: 48px; margin: 0; font-weight: 800;">${statusLabel}</h1>
                  <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 5px 20px; border-radius: 50px; margin-top: 15px; font-weight: bold;">
                    Score: ${score} / 100
                  </div>
                </div>

                <div style="padding: 40px;">
                  
                  <div style="border-left: 4px solid ${statusColor}; padding: 15px 20px; background: #f9fafb; margin-bottom: 30px;">
                    <strong style="display: block; font-size: 13px; color: ${statusColor}; text-transform: uppercase; margin-bottom: 5px;">Summary</strong>
                    <div style="font-size: 18px; color: #1f2937; font-weight: bold;">${summary}</div>
                  </div>

                  <div style="margin-bottom: 30px;">
                    <h3 style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px;">分析理由</h3>
                    <div style="color: #4b5563; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${reason}</div>
                  </div>

                  <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; border: 1px solid #dbeafe;">
                    <h3 style="font-size: 14px; color: #1d4ed8; margin: 0 0 8px 0; display: flex; align-items: center;">💡 運営へのアドバイス</h3>
                    <div style="color: #1e40af; font-size: 15px; line-height: 1.6;">${advice}</div>
                  </div>

                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px dashed #e5e7eb;">
                    <h4 style="font-size: 12px; color: #9ca3af; text-transform: uppercase; margin-bottom: 15px;">Original Request Data</h4>
                    <div style="font-size: 13px; color: #374151; background: #fdfdfd; padding: 15px; border-radius: 8px;">
                      <strong>名前:</strong> ${body.name}<br>
                      <strong>予算:</strong> ${body.budget}<br>
                      <strong>内容:</strong> ${body.detail}
                    </div>
                  </div>

                </div>

                <div style="background-color: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 11px;">
                  CORE LINKS STUDIO - SECURE AI GATEWAY v2.5
                </div>
              </div>
            </div>
          `
        });
        console.log("✅ 美麗レポートの送信が完了しました");
      } catch (innerError) {
        console.error("❌ バックグラウンド処理エラー:", innerError);
      }
    })();

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Fatal Error" }, { status: 500 });
  }
}