'use strict';
window.addEventListener('load', () => {

  let forwarding = false;

  const observer = new MutationObserver(() => {
    for (const handle of document.querySelectorAll('.WB_feed_handle ul:not([awsl="yes"])')) {
      const forward = handle.querySelector('a[action-type="fl_forward"]');
      if (!forward) continue;

      const a = document.createElement('a');
      a.className = 'S_txt2';
      a.innerHTML = `
        <span class="pos"><span class="line S_line1"><span>
          <em class="W_ficon ficon_forward S_ficon"></em>
          <em>AWSL!</em>
        </span></span></span>
      `;

      a.addEventListener('click', () => {
        forwarding = true;
        forward.click();
      });

      const li = document.createElement('li');
      li.appendChild(a);

      handle.prepend(li);
      handle.setAttribute('awsl', 'yes');
    }

    if (forwarding) {
      const forwardLayer = document.querySelector('.layer_forward');
      if (!forwardLayer) return;

      forwarding = false;

      const textarea = forwardLayer.querySelector('textarea.W_input');
      const submit = forwardLayer.querySelector('.W_btn_a[node-type="submit"]');

      textarea.value = 'awsl' + textarea.value;
      submit.click();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

});
