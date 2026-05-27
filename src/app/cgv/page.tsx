import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = {
  title: 'Conditions Générales de Vente — Black Out!',
}

export default function CGVPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-300">
      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10"
        >
          <ChevronLeft size={16} />
          Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Conditions Générales de Vente</h1>
        <p className="text-sm text-zinc-500 mb-10">Dernière mise à jour : mai 2025</p>

        <div className="space-y-8 text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'achat et l'utilisation des
              passes d'accès au jeu urbain interactif <strong className="text-zinc-100">Black Out!</strong>,
              édité et exploité par [Raison sociale – À REMPLIR], ci-après dénommé « l'Éditeur ».
            </p>
            <p className="mt-2">
              Tout achat d'un pass vaut acceptation pleine et entière des présentes CGV.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">2. Description du service</h2>
            <p>
              Black Out! est un rallye urbain gamifié, accessible via une Progressive Web App (PWA).
              Le joueur achète un pass à usage unique (29 CHF par partie), lui donnant accès à un
              scénario géolocalisé dans la ville choisie, à des défis à compléter en équipe, à une
              Roulette de la Honte et à la génération d'un film souvenir automatisé.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Prix et paiement</h2>
            <p>
              Les prix sont indiqués en francs suisses (CHF), toutes taxes comprises. L'Éditeur se
              réserve le droit de modifier ses tarifs à tout moment. Le prix applicable est celui affiché
              au moment de la commande.
            </p>
            <p className="mt-2">
              Le paiement est exigible immédiatement à la commande. En l'absence de paiement validé,
              aucun pass n'est délivré.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">4. Codes cadeaux</h2>
            <p>
              Les passes peuvent être offerts sous forme de code cadeau. Le code est à usage unique,
              nominatif une fois activé, et ne peut pas être échangé contre de l'argent. Les codes
              cadeaux sont valables 12 mois à compter de leur date d'émission.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Droit de rétractation</h2>
            <p>
              Conformément à l'art. 40d CO (Code des obligations suisse), le droit de rétractation de
              14 jours ne s'applique pas aux contenus numériques dont l'exécution a commencé avec
              l'accord du consommateur. L'activation du pass vaut consentement exprès à l'exécution
              immédiate du contrat ; aucun remboursement ne sera accordé une fois la partie lancée.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">6. Contenu Généré par l'Utilisateur (UGC)</h2>
            <p>
              Dans le cadre du jeu, les joueurs sont invités à soumettre des photos et vidéos
              (ci-après « Contenus UGC »). En soumettant un Contenu UGC, le joueur :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Déclare</strong> être l'auteur ou détenir tous les droits
                nécessaires sur le contenu soumis, et que celui-ci ne porte atteinte à aucun droit de
                tiers (image, propriété intellectuelle, vie privée).
              </li>
              <li>
                <strong className="text-zinc-200">Accorde à l'Éditeur</strong> une licence mondiale, non
                exclusive, gratuite, pour utiliser, reproduire, intégrer et diffuser ce contenu dans le
                film souvenir généré et, le cas échéant, à des fins de communication et de promotion du
                service, sans limitation de durée.
              </li>
              <li>
                <strong className="text-zinc-200">Reconnaît</strong> que l'Éditeur agit en qualité
                d'hébergeur au sens de la loi fédérale suisse sur les téléservices (LTC) et de la
                Directive européenne e-Commerce 2000/31/CE : l'Éditeur n'est pas responsable des
                Contenus UGC, ne les contrôle pas a priori et ne peut en être tenu responsable sauf
                connaissance avérée d'un contenu manifestement illicite.
              </li>
              <li>
                <strong className="text-zinc-200">S'engage</strong> à ne pas soumettre de contenu
                illicite, offensant, pornographique, diffamatoire ou portant atteinte à des droits de
                tiers. L'Éditeur se réserve le droit de supprimer tout contenu non conforme sans préavis.
              </li>
            </ul>
            <p className="mt-3 text-zinc-500 text-xs italic">
              Les Contenus UGC sont hébergés de manière éphémère et utilisés exclusivement pour la
              génération du film souvenir automatisé. Ils ne sont pas conservés au-delà de 30 jours
              après la partie, sauf opposition du joueur formulée par écrit.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">7. Responsabilité</h2>
            <p>
              La participation à Black Out! implique des déplacements dans l'espace public. Le joueur
              est seul responsable de sa sécurité et du respect du Code de la route et des règles de
              savoir-vivre. L'Éditeur décline toute responsabilité en cas d'accident, de dommage
              corporel ou matériel survenu lors du jeu.
            </p>
            <p className="mt-2">
              Le service est fourni « en l'état ». L'Éditeur ne garantit pas une disponibilité
              ininterrompue de la plateforme et se réserve le droit de la suspendre à tout moment
              pour maintenance.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">8. Protection des données</h2>
            <p>
              Les données personnelles collectées (email, historique de partie, médias) sont traitées
              conformément à la Loi fédérale suisse sur la protection des données (nLPD) du
              25 septembre 2020. Elles ne sont pas cédées à des tiers. Toute demande d'accès,
              rectification ou suppression peut être adressée à [email de contact – À REMPLIR].
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">9. Loi applicable et for juridique</h2>
            <p>
              Les présentes CGV sont régies par le droit suisse. Tout litige relatif à leur
              interprétation ou à leur exécution sera soumis à la compétence exclusive des tribunaux
              du <strong className="text-zinc-100">Canton du Valais, Suisse</strong>.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">10. Modification des CGV</h2>
            <p>
              L'Éditeur se réserve le droit de modifier les présentes CGV à tout moment. Les nouvelles
              CGV s'appliquent dès leur publication sur la plateforme. L'utilisation du service après
              publication vaut acceptation des nouvelles conditions.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
