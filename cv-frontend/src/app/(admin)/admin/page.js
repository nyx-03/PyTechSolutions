export default function AdminHomePage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p style={{ opacity: 0.85 }}>
        Bienvenue dans le panneau d’administration. On va brancher ici les stats,
        les actions rapides, et les liens de gestion.
      </p>

      <ul>
        <li>Gestion des utilisateurs & rôles</li>
        <li>CRUD Réalisations</li>
        <li>Plus tard : contenus, médias, etc.</li>
      </ul>
    </div>
  );
}