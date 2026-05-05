export const metadata = {
  title: "Painel Capital · Media Ops",
  description: "Painel de mídia · Capital de Prêmios + Capital Cena",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
