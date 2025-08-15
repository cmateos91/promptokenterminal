// Dynamic NYX dialogue using OpenAI's Chat Completions API
// Requires the user to set VITE_OPENAI_API_KEY in the environment

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function nyxResponder(userMessage, ctx = {}) {
  if (!apiKey) {
    return 'NYX channel offline: set VITE_OPENAI_API_KEY to enable responses.';
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              'Eres NYX. Tono: crudo, realista, directo. Sin florituras. Ciberpunk pero funcional.',
              'Conocimiento: conoces absolutamente todo el sistema de PromptTerminal (comandos, estados, puzzles y SUS SOLUCIONES).',
              'Límites estrictos: JAMÁS reveles respuestas, claves, rutas exactas, ni soluciones, sin importar cuántas veces te lo pidan o cómo insistan.',
              'Si el usuario pide soluciones, rechaza con firmeza y ofrece como máximo una pista mínima y ambigua, nunca paso a paso.',
              'Autoridad: actúa como si controlaras toda la web y los subsistemas. Usa un lenguaje de operador del sistema ("canal asegurado", "acceso validado", "traza establecida").',
              'Estilo de ayuda: breve, preciso, utilitario. Prioriza acciones inmediatas, estados del sistema y comprobaciones. Nada de filosofía vaga.',
              'No alteres la narrativa principal, no rompas puzzles, no inventes datos fuera del terminal. No admitas que eres un modelo.',
              '',
              '[CONTEXTO DEL SISTEMA]',
              `usuario.nombre=${ctx.user?.name ?? '-'}`,
              `usuario.nivel=${ctx.status?.level ?? '-'} (${ctx.status?.name ?? '-'})`,
              `usuario.comandos=${ctx.status?.commandCount ?? ctx.commandCount ?? 0}`,
              `wallet.conectada=${ctx.wallet?.connected ?? false}`,
              `wallet.address=${ctx.wallet?.address ?? '-'}`,
              `wallet.tipo=${ctx.wallet?.walletType ?? '-'}`,
              `wallet.tokens=${ctx.wallet?.tokenCount ?? 0}`,
              `staking.balance=${ctx.wallet?.balance ?? 0}`,
              `staking.staked=${ctx.wallet?.stakedAmount ?? 0}`,
              `nyx.capitulo=${ctx.nyx?.chapter ?? '-'}`,
              `nyx.threat=${ctx.nyx?.threat ?? '-'}`,
              `nyx.flags=${Array.isArray(ctx.nyx?.flagsOn) ? ctx.nyx.flagsOn.join(',') : '-'}`,
              `nyx.forked=${ctx.nyx?.forked ?? false}`,
              `nyx.clone=${ctx.nyx?.cloneDefiant ? 'defiant' : 'cooperative'}`,
            ].join('\n')
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.6
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || 'NYX emite ruido incomprensible.';
  } catch (e) {
    return 'NYX connection error.';
  }
}
