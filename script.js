/**
 * Fawran Closed Testing Landing Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnCopyEmail = document.getElementById('btn-copy-email');
  const groupEmailText = document.getElementById('group-email').textContent.trim();
  const checkJoined = document.getElementById('check-joined');
  const cardStep1 = document.getElementById('card-step-1');
  const cardStep2 = document.getElementById('card-step-2');
  const chipStep1 = document.getElementById('chip-step-1');
  const chipStep2 = document.getElementById('chip-step-2');
  const stepNav1 = document.getElementById('step-nav-1');
  const stepNav2 = document.getElementById('step-nav-2');
  const stepperProgress = document.getElementById('stepper-progress');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const btnShare = document.getElementById('btn-share-page');

  let toastTimeout = null;

  /**
   * Display toast notification
   */
  function showToast(message, duration = 3000) {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastMessage.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Copy text to clipboard with fallback
   */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }

  /**
   * Handle Copy Email
   */
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', async () => {
      const ok = await copyToClipboard(groupEmailText);
      if (ok) {
        showToast('تم نسخ الإيميل بنجاح! يمكنك استخدامه للانضمام.');
        const originalHtml = btnCopyEmail.innerHTML;
        btnCopyEmail.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10B981" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style="color: #34D399;">تم النسخ ✓</span>
        `;
        setTimeout(() => {
          btnCopyEmail.innerHTML = originalHtml;
        }, 2500);
      } else {
        showToast('تعذر النسخ تلقائياً، يرجى نسخه يدوياً');
      }
    });
  }

  /**
   * Update Step 2 State based on Step 1 completion
   */
  function setJoinedState(isJoined, shouldScroll = false) {
    if (isJoined) {
      cardStep1.classList.remove('active-card');
      cardStep1.classList.add('completed-card');
      chipStep1.textContent = 'تم الانضمام ✓';
      chipStep1.className = 'step-status-chip done';

      cardStep2.classList.add('active-card');
      chipStep2.textContent = 'جاهز للتحميل الآن!';
      chipStep2.className = 'step-status-chip ready';

      stepNav1.classList.remove('active');
      stepNav1.classList.add('completed');
      stepNav1.querySelector('.step-circle').textContent = '✓';

      stepNav2.classList.add('active');
      stepperProgress.classList.add('completed');

      localStorage.setItem('fawran_joined_group', 'true');

      if (shouldScroll) {
        setTimeout(() => {
          cardStep2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    } else {
      cardStep1.classList.add('active-card');
      cardStep1.classList.remove('completed-card');
      chipStep1.textContent = 'مطلوب أولاً';
      chipStep1.className = 'step-status-chip';

      cardStep2.classList.remove('active-card');
      chipStep2.textContent = 'جاهز للتحميل';
      chipStep2.className = 'step-status-chip ready';

      stepNav1.classList.add('active');
      stepNav1.classList.remove('completed');
      stepNav1.querySelector('.step-circle').textContent = '1';

      stepNav2.classList.remove('active');
      stepperProgress.classList.remove('completed');

      localStorage.removeItem('fawran_joined_group');
    }
  }

  // Checkbox listener
  if (checkJoined) {
    // Restore from localStorage
    const savedState = localStorage.getItem('fawran_joined_group') === 'true';
    if (savedState) {
      checkJoined.checked = true;
      setJoinedState(true, false);
    }

    checkJoined.addEventListener('change', (e) => {
      setJoinedState(e.target.checked, e.target.checked);
    });
  }

  /**
   * Native Share or Copy URL
   */
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareData = {
        title: 'تحميل تطبيق فوراً - برنامج الاختبار المغلق',
        text: 'انضم لمجموعة المختبرين وحمّل تطبيق فوراً على Google Play:',
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            fallbackShare();
          }
        }
      } else {
        fallbackShare();
      }
    });

    async function fallbackShare() {
      const ok = await copyToClipboard(window.location.href);
      if (ok) {
        showToast('تم نسخ رابط الصفحة إلى الحافظة!');
      } else {
        showToast('انسخ الرابط من شريط عنوان المتصفح');
      }
    }
  }
});
