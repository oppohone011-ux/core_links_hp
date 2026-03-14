import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

// APIキーの読み込み
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, domain, budget, detail } = body;
    
    let aiResponse = "AI解析が実行できませんでした。";

    // 1. AI門番（Gemini）による分析
    try {
      // モデル指定を最も標準的な形にします
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        あなたは「CORE LINKS STUDIO」のAI門番です。
        以下のお問い合わせに対し、熱意、ビジネスインパクト、実現可能性を分析し、
        100点満点でスコアを付けてください。また、運営に向けた短いアドバイスも書いてください。

        ---
        名前: ${name}
        メール: ${email}
        領域: ${domain}
        予算: ${budget}
        内容: ${detail}
      `;

      // 最新の安全な実行方法
      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();
      
      console.log("--- 🤖 AI分析成功 ---");
    } catch (aiError: any) {
      console.error("AI解析エラー詳細:", aiError.message);
      aiResponse = `AI解析で一時的なエラーが発生しました。内容は以下の通り転送します。`;
    }

    // 2. メール送信
    await resend.emails.send({
      from: 'CoreLinks Gate <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL as string,
      subject: `【AI判定済み】${name}様よりお問い合わせ`,
      html: `
        <h3>お問い合わせ内容</h3>
        <p>名前: ${name}</p>
        <p>メール: ${email}</p>
        <p>領域: ${domain}</p>
        <p>予算: ${budget}</p>
        <p>内容: ${detail}</p>
        <hr />
        <h3>🤖 AI門番の解析レポート</h3>
        <div style="white-space: pre-wrap; background: #f4f4f4; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
          ${aiResponse}
        </div>
      `,
    });

    console.log("--- 📧 メール送信完了 ---");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Critical Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}