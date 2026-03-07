import { registerModule } from '@/module';

registerModule({
  id: 'expand_replies',
  name: '展开评论区回复浮层',
  defaultEnabled: true,
  setup() {
    const style = document.createElement('style');
    style.textContent = '[class*="_scroll3_"] { height: auto !important; max-height: calc(100vh - 200px) !important; }';
    document.head.appendChild(style);
  },
});
