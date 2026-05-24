/**
 * filters.js
 * ─────────────────────────────────────────────────────────
 * Filtrage des projets par catégorie.
 *
 * COMMENT AJOUTER UN PROJET :
 *   Dans index.html, duplique une <div class="project-row">
 *   et change l'attribut data-cat parmi :
 *     fullstack | frontend | backend | mobile
 *
 * COMMENT AJOUTER UNE CATÉGORIE :
 *   1. Ajoute un bouton dans #filters :
 *      <button class="filter-btn" data-filter="ta-cat">Libellé</button>
 *   2. Mets data-cat="ta-cat" sur tes project-row concernées.
 * ─────────────────────────────────────────────────────────
 */

(function () {

  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectRows = document.querySelectorAll('.project-row');

  // Crée le message "aucun résultat" s'il n'existe pas
  let noResults = document.querySelector('.no-results');
  if (!noResults) {
    noResults = document.createElement('p');
    noResults.className = 'no-results';
    noResults.textContent = '— Aucun projet dans cette catégorie';
    document.getElementById('projectList').appendChild(noResults);
  }

  /* ── Fonction principale de filtre ── */
  function applyFilter(filter) {
    let visibleCount = 0;

    projectRows.forEach((row) => {
      const cat = row.getAttribute('data-cat');
      const match = (filter === 'all') || (cat === filter);

      if (match) {
        row.classList.remove('hidden');
        visibleCount++;
      } else {
        row.classList.add('hidden');
      }
    });

    // Message si aucun résultat
    noResults.classList.toggle('visible', visibleCount === 0);

    // Re-joue l'animation sur les lignes visibles
    if (typeof window.animateVisibleRows === 'function') {
      window.animateVisibleRows();
    }
  }

  /* ── Event listeners sur les boutons ── */
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {

      // État actif visuel
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Applique le filtre
      const filter = btn.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  /* ── Renumérote les lignes visibles (optionnel, peut être commenté) ── */
  // Si tu veux que les numéros restent consécutifs après filtrage,
  // décommente ce bloc :
  /*
  function renumberVisible() {
    let count = 1;
    projectRows.forEach((row) => {
      if (!row.classList.contains('hidden')) {
        const numEl = row.querySelector('.project-row-num');
        if (numEl) numEl.textContent = String(count).padStart(3, '0');
        count++;
      }
    });
  }
  */

})();
