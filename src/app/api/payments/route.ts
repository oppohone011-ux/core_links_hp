import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- 1. データ取得 (GET) ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  try {
    // 全件取得（作成日順）
    if (type === "list") {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- 2. 解析 & 新規保存 (POST) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 【確定保存】
    if (body.isConfirm) {
      const { isConfirm, ...dataToSave } = body;
      // 数値型と日付型を安全に処理
      const payload = {
        ...dataToSave,
        amount: Number(dataToSave.amount),
        is_completed: dataToSave.is_completed || false,
        due_date: dataToSave.due_date || null
      };
      
      const { data, error } = await supabase.from('payments').insert([payload]).select();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // 【音声解析】
    const message = body.message;
    if (!message) return NextResponse.json({ success: false, error: "空です" }, { status: 400 });

    const amountMatch = message.match(/(\d+)\s*(万?円)/);
    let amount = null;
    if (amountMatch) {
      amount = parseInt(amountMatch[1]);
      if (amountMatch[2].includes("万")) amount *= 10000;
    }

    // 日付補完（日がない場合は01日に設定）
    const dateMatch = message.match(/(\d+)月(?:(\d+)日)?/);
    let due_date = null;
    if (dateMatch) {
      const year = new Date().getFullYear();
      const month = dateMatch[1].padStart(2, '0');
      const day = (dateMatch[2] || "01").padStart(2, '0');
      due_date = `${year}-${month}-${day}`;
    }

    const content = message.replace(/(\d+)\s*万?円/g, "").replace(/\d+月(?:\d+日)?/g, "").trim() || "不明な支払い";

    return NextResponse.json({ 
      success: true, 
      data: { due_date, amount, content, payment_method: message.includes("振込") ? "振込" : "その他" } 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- 3. ステータス・内容更新 (PATCH) ---
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, content, amount, due_date, payment_method, bank_account, is_completed } = body;

    const { data, error } = await supabase
      .from('payments')
      .update({ 
        content, 
        amount: Number(amount), // 確実に数値として保存
        due_date, 
        payment_method, 
        bank_account, 
        is_completed 
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- 4. 削除 (DELETE) ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("IDが必要です");

    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}