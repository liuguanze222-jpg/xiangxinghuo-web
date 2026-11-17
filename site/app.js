// 乡星火官网 —— 滚动揭示 / 数字滚动 / 环形图绘制 / 导航状态
(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  // 数字滚动
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = Number(el.dataset.count || 0);
        const dur = 1100;
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

  // 环形图：按百分比切分（r=86 -> 周长约 540.35）
  const R = 86;
  const C = 2 * Math.PI * R;
  document.querySelectorAll('.donut').forEach((svg) => {
    const values = (svg.dataset.donut || '').split(',').map(Number).filter((n) => n > 0);
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const segs = svg.querySelectorAll('.dseg');
    let offset = 0;
    segs.forEach((seg, i) => {
      const v = values[i] || 0;
      const len = (v / total) * C;
      seg.style.strokeDashoffset = String(-offset);
      seg.style.setProperty('--dash', `${len * 0.995} ${C}`);
      offset += len;
    });
    const fig = svg.closest('.chart');
    const chartIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            fig.classList.add('in');
            chartIO.unobserve(fig);
          }
        });
      },
      { threshold: 0.4 }
    );
    chartIO.observe(fig);
  });

  // 收入条
  const rev = document.querySelector('.revenue');
  if (rev) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            rev.classList.add('in');
          }
        });
      },
      { threshold: 0.35 }
    ).observe(rev);
  }

  // 导航背景
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('on', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 首屏轻微视差
  const right = document.querySelector('.hero-right');
  if (right && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const y = Math.min(window.scrollY, 600);
        right.style.transform = `translateY(${y * -0.06}px)`;
      },
      { passive: true }
    );
  }
})();
