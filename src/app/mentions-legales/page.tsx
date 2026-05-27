import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = {
  title: 'Mentions Légales — Black Out!',
}

export default function MentionsLegalesPage() {
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

        <h1 className="text-3xl font-black text-white mb-2">Mentions Légales</h1>
        <p className="text-sm text-zinc-500 mb-10">Dernière mise à jour : mai 2025</p>

        <div className="space-y-8 text-sm leading-relaxed">

          {/* Éditeur */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Éditeur du site</h2>
            <dl className="space-y-1.5 text-zinc-400">
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Raison sociale</dt>
                <dd className="text-yellow-400/80">[À REMPLIR]</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Forme juridique</dt>
                <dd>[À REMPLIR — ex: Entreprise individuelle / Sàrl]</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Siège social</dt>
                <dd>[Adresse complète — À REMPLIR], Valais, Suisse</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">N° IDE (CHE)</dt>
                <dd className="text-yellow-400/80">[CHE-XXX.XXX.XXX — À REMPLIR]</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Responsable</dt>
                <dd>[Prénom Nom — À REMPLIR]</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">E-mail</dt>
                <dd>
                  <a
                    href="mailto:[email@domaine.ch]"
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    [email@domaine.ch — À REMPLIR]
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Hébergement</h2>
            <dl className="space-y-1.5 text-zinc-400">
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Hébergeur plateforme</dt>
                <dd>Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Base de données</dt>
                <dd>Supabase Inc., 970 Toa Payoh North, Singapour</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Stockage médias</dt>
                <dd>Supabase Storage (infrastructure AWS S3 compatible)</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-zinc-500 shrink-0 w-36">Génération vidéo</dt>
                <dd>Shotstack Pty Ltd, Brisbane, Australie</dd>
              </div>
            </dl>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, scénarios, logo, code source) est la
              propriété exclusive de [À REMPLIR] et est protégé par le droit d'auteur suisse
              (LDA — Loi fédérale sur le droit d'auteur). Toute reproduction, même partielle, est
              interdite sans autorisation écrite préalable.
            </p>
          </section>

          {/* Protection des données */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Protection des données personnelles</h2>
            <p>
              Conformément à la Loi fédérale suisse sur la protection des données (nLPD, entrée en
              vigueur le 1er septembre 2023), vous disposez d'un droit d'accès, de rectification et
              de suppression de vos données personnelles.
            </p>
            <p className="mt-2">
              Les données collectées (adresse e-mail, historique de partie, médias uploadés) sont
              utilisées exclusivement pour le fonctionnement du service. Elles ne sont jamais vendues
              ni cédées à des tiers à des fins commerciales.
            </p>
            <p className="mt-2">
              Pour exercer vos droits : <span className="text-violet-400">[email@domaine.ch — À REMPLIR]</span>
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Cookies et données de session</h2>
            <p>
              Ce site utilise des cookies de session nécessaires au fonctionnement de
              l'authentification (Supabase Auth). Aucun cookie publicitaire ou de traçage tiers n'est
              utilisé. En continuant à utiliser le site, vous acceptez l'utilisation de ces cookies
              techniques strictement nécessaires.
            </p>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Limitation de responsabilité</h2>
            <p>
              L'Éditeur s'efforce de maintenir le site accessible 24h/24 et 7j/7, mais ne saurait
              être tenu responsable des interruptions de service, qu'elles soient dues à des
              opérations de maintenance, à des pannes techniques ou à des causes extérieures.
            </p>
            <p className="mt-2">
              Les contenus soumis par les utilisateurs (photos, vidéos) engagent la seule
              responsabilité de leurs auteurs. Voir les{' '}
              <Link href="/cgv" className="text-violet-400 hover:text-violet-300 transition-colors">
                Conditions Générales de Vente
              </Link>{' '}
              pour la politique UGC complète.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-base font-bold text-white mb-3">Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit suisse. Tout litige relève de
              la compétence exclusive des tribunaux du{' '}
              <strong className="text-zinc-100">Canton du Valais, Suisse</strong>.
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
