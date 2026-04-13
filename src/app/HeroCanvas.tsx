"use client";

import { useEffect, useRef } from "react";
// 同じappフォルダにあるHome.module.cssからデザインを読み込みます
import styles from "./Home.module.css"; 

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 点（パーティクル）のデータを格納する配列
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    let animationFrameId: number;

    // キャンバスのサイズ設定と点の初期化
    const init = () => {
      // 親要素（heroInnerなど）のサイズに合わせる
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      
      particles = [];
      // 画面の広さに合わせて点の数を調整
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < Math.min(particleCount, 80); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // 動く速度（X軸）
          vy: (Math.random() - 0.5) * 0.5, // 動く速度（Y軸）
          size: Math.random() * 1.5 + 1,
        });
      }
    };

    // 描画ループ
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 点と線の色設定（少し薄めのグレー）
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)"; 
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)"; 

      particles.forEach((p, i) => {
        // 位置を更新
        p.x += p.vx;
        p.y += p.vy;

        // 壁に当たったら跳ね返る
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 点を描く
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 近い点同士を線で結ぶ（コアリンクスの「繋がり」を表現）
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.lineWidth = 1 - dist / 150;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    draw();

    // 後片付け
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.heroCanvas} />;
}