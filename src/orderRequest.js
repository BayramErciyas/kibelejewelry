// Existing store contact, also used by the footer and custom-design page.
export const STORE_WHATSAPP = 'https://wa.me/905050349650';
export const STORE_EMAIL = 'kibelejewellery@gmail.com';

export const orderRequestCopy = {
  TR: {
    title: 'SİPARİŞ TALEBİ', prepare: 'SİPARİŞ TALEBİ HAZIRLA',
    notice: 'Online ödeme şu anda kullanılamıyor. Burada ödeme alınmaz ve sipariş oluşturulmaz. Bu yalnızca bir sipariş talebidir. Stok, güncel fiyat, kargo ve güvenli ödeme yöntemi mağaza tarafından ayrıca teyit edilir. Kart bilgilerinizi mesajla paylaşmayın.',
    open: 'WHATSAPP’TA TALEBİ AÇ', back: 'SEPETE DÖN',
    instructions: 'Mesajı WhatsApp’ta kendiniz göndermelisiniz. Bağlantıyı açmak mesajın iletildiğini veya siparişin onaylandığını göstermez. Sepetiniz korunur. WhatsApp açılmazsa aşağıdaki metni seçip kopyalayarak mağazaya e-posta gönderebilirsiniz.',
    draft: 'Talep metni', total: 'Ürün ara toplamı (kargo hariç)',
    invalid: 'Bazı ürün bilgileri veya fiyatları geçersiz. Talep hazırlamak için bu ürünleri sepetten kaldırıp tekrar ekleyin ya da mağazayla iletişime geçin.',
    long: 'Talep bağlantı için çok uzun. Metni seçip kopyalayarak WhatsApp veya e-posta üzerinden kendiniz gönderin.',
    contact: 'Mağazaya e-posta', intro: 'Kibele Jewelry — sipariş talebi (ödenmedi, onaylanmadı)',
    confirm: 'Lütfen stok, güncel fiyat, kargo ve güvenli ödeme yöntemi hakkında bilgi verin. Bu talep ödeme veya kesinleşmiş sipariş değildir.',
  },
  EN: {
    title: 'ORDER REQUEST', prepare: 'PREPARE ORDER REQUEST',
    notice: 'Online payment is currently unavailable. No payment is taken and no order is created here. This is only an order request. The store must confirm availability, current prices, shipping and a secure payment method separately. Never share card details in messages.',
    open: 'OPEN REQUEST IN WHATSAPP', back: 'BACK TO BAG',
    instructions: 'You must send the message yourself in WhatsApp. Opening the link does not confirm delivery or order acceptance. Your bag is kept. If WhatsApp does not open, select and copy the text below and email the store.',
    draft: 'Request text', total: 'Product subtotal (excluding shipping)',
    invalid: 'Some product details or prices are invalid. Remove and add those products again before preparing a request, or contact the store.',
    long: 'The request is too long for a link. Select and copy the text and send it yourself via WhatsApp or email.',
    contact: 'Email the store', intro: 'Kibele Jewelry — order request (unpaid, unconfirmed)',
    confirm: 'Please confirm availability, current prices, shipping and a secure payment method. This request is not a payment or a confirmed order.',
  },
  ZH: {
    title: '订单咨询', prepare: '准备订单咨询',
    notice: '目前无法在线付款。此处不会收款或创建订单，仅准备订单咨询。库存、当前价格、运费和安全付款方式须由门店另行确认。请勿通过消息发送银行卡信息。',
    open: '在 WHATSAPP 中打开咨询', back: '返回购物篮',
    instructions: '您需要在 WhatsApp 中自行发送消息。打开链接不代表消息已送达或订单已确认。购物篮将保留。如果无法打开 WhatsApp，请选择并复制下方文字，通过电子邮件联系门店。',
    draft: '咨询内容', total: '商品小计（不含运费）',
    invalid: '部分商品信息或价格无效。请删除并重新添加相关商品，或联系门店。',
    long: '咨询内容过长，无法放入链接。请选择并复制文字，自行通过 WhatsApp 或电子邮件发送。',
    contact: '发送电子邮件至门店', intro: 'Kibele Jewelry — 订单咨询（未付款，未确认）',
    confirm: '请确认库存、当前价格、运费和安全付款方式。此咨询不代表付款或已确认的订单。',
  },
  ES: {
    title: 'SOLICITUD DE PEDIDO', prepare: 'PREPARAR SOLICITUD DE PEDIDO',
    notice: 'El pago en línea no está disponible. Aquí no se cobra ni se crea un pedido. Esto es solo una solicitud. La tienda debe confirmar existencias, precios actuales, envío y un método de pago seguro por separado. No comparta datos de tarjeta por mensaje.',
    open: 'ABRIR SOLICITUD EN WHATSAPP', back: 'VOLVER A LA BOLSA',
    instructions: 'Debe enviar el mensaje usted mismo en WhatsApp. Abrir el enlace no confirma la entrega ni la aceptación del pedido. Su bolsa se conserva. Si WhatsApp no abre, seleccione y copie el texto para enviarlo por correo a la tienda.',
    draft: 'Texto de la solicitud', total: 'Subtotal de productos (sin envío)',
    invalid: 'Algunos datos o precios no son válidos. Quite y vuelva a añadir esos productos o contacte con la tienda.',
    long: 'La solicitud es demasiado larga para un enlace. Seleccione y copie el texto y envíelo usted mismo por WhatsApp o correo.',
    contact: 'Enviar correo a la tienda', intro: 'Kibele Jewelry — solicitud de pedido (sin pagar, sin confirmar)',
    confirm: 'Confirmen existencias, precios actuales, envío y un método de pago seguro. Esta solicitud no constituye un pago ni un pedido confirmado.',
  },
};

// Display-only estimate. It must never be used to create a charge or mark an order paid.
export function buildOrderRequest(cart, lang, formatPrice) {
  const copy = orderRequestCopy[lang] || orderRequestCopy.TR;
  const valid = Array.isArray(cart) && cart.length > 0 && cart.every(item =>
    item && item.id != null && String(item.id).trim() &&
    String(item.name || item.title || '').trim() &&
    (typeof item.price === 'number' || typeof item.price === 'string') &&
    String(item.price).trim() && Number.isFinite(Number(item.price)) && Number(item.price) >= 0
  );
  if (!valid) return { error: 'invalid', text: '', href: null, total: null };
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  if (!Number.isFinite(total)) return { error: 'invalid', text: '', href: null, total: null };
  const lines = cart.map((item, index) =>
    `${index + 1}. ${item.name || item.title} [ID: ${item.id}] — ${formatPrice(item.price)} (TRY ${Number(item.price)})`
  );
  const text = [copy.intro, '', ...lines, '', `${copy.total}: ${formatPrice(total)} (TRY ${total})`, '', copy.confirm].join('\n');
  const href = `${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`;
  // Large carts still have the full text available for manual copying.
  return { error: null, text, total, href: href.length <= 7500 ? href : null };
}
