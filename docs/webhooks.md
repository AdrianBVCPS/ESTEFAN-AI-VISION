# Configurar Webhook de Stripe — Paso a paso

## Paso 1: Abre el Dashboard de Stripe

1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Inicia sesion con tu cuenta (TecnonSmart)

## Paso 2: Ve a la seccion de Webhooks

1. En el menu de la izquierda, haz clic en **"Developers"** (Desarrolladores)
2. Luego haz clic en la pestana **"Webhooks"**
3. Haz clic en el boton **"+ Add endpoint"** (Anadir endpoint)

## Paso 3: Configura el endpoint

En el formulario que aparece:

1. **Endpoint URL** — Pega exactamente esto:

```
https://estefan-ai-vision.vercel.app/api/stripe/webhook
```

2. **Events to send** — Haz clic en **"Select events"** y marca EXACTAMENTE estos 5:

- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.deleted`
- `customer.subscription.updated`

3. Haz clic en **"Add endpoint"** para guardarlo

## Paso 4: Copia el Signing Secret

1. Una vez creado, Stripe te lleva a la pagina del endpoint
2. Veras una seccion que dice **"Signing secret"**
3. Haz clic en **"Reveal"** (Revelar) para ver el secreto
4. Copia el valor completo — empieza por `whsec_...`

## Paso 5: Anadelo a Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Abre tu proyecto **ESTEFAN-AI-VISION**
3. Ve a **Settings** > **Environment Variables**
4. Busca o crea la variable:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** Pega el `whsec_...` que copiaste
   - **Environments:** marca Production (y Preview si quieres)
5. Haz clic en **Save**

## Paso 6: Redespliega

1. Vuelve a la pestana **Deployments** de tu proyecto en Vercel
2. En el despliegue mas reciente, haz clic en los **tres puntos (...)** > **"Redeploy"**
3. Confirma. Vercel hara un nuevo build con la variable ya cargada

## Paso 7: Verifica que funciona

1. Vuelve al Dashboard de Stripe > Developers > Webhooks
2. Haz clic en tu endpoint
3. Haz clic en **"Send test webhook"**
4. Selecciona el evento `checkout.session.completed`
5. Haz clic en **"Send test webhook"**
6. Si ves **"200 OK"** en verde, todo funciona

---

Listo. Cuando un usuario pague o su suscripcion cambie, Stripe avisara a tu app automaticamente y se actualizara el estado en la base de datos.
