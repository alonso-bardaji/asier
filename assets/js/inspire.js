/*
	Dimension by HTML5 UP
	@aloasier
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

async function fetchInspireHEP() {
	try {
		let allPapers = [];
		let url = 'https://inspirehep.net/api/literature?sort=mostrecent&q=author%3A%22Alonso-Bardaji%2C%20Asier%22&size=100';

		// Fetch all pages
		while (url) {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch data');
			const data = await response.json();
			allPapers = allPapers.concat(data.hits.hits);
			url = data.links?.next || null;
		}

		// Initialize stats
		let publications = 0;
		let citations = 0;
		let hIndex = 0;
		let output = '<ul style="list-style-type: disc">';

		allPapers.forEach(paper => {
			let title = paper.metadata.titles?.[0]?.title || 'No title available';

			// Exclude specific paper
			if (title === "Loop Quantum Gravity Effects on Spherical Black Holes. A Covariant Approach to Singularity Resolution") {
				return;
			}

			let link = `https://inspirehep.net/literature/${paper.metadata.control_number}`;
			let authors = paper.metadata.authors?.map(a => a.full_name.split(', ').reverse().join(' ')).join(', ') || 'Unknown authors';

			let pubInfo = 'Preprint';
			let year = paper.metadata.earliest_date ? ` (${paper.metadata.earliest_date.substring(0, 4)})` : '';
			if (paper.metadata.publication_info?.length > 0) {
				let pubData = paper.metadata.publication_info.find(info => info.journal_title) || paper.metadata.publication_info[0];
				let journal = pubData.journal_title || '';
				let volume = pubData.journal_volume || '';
				let pages = pubData.artid || '';
				let pubYear = pubData.year ? `(${pubData.year})` : '';

				pubInfo = `${journal} ${volume}, ${pages} ${pubYear}`.trim();
				publications += 1;
			} else {
				pubInfo += year;
			}

			output += `<li style="margin-bottom: 1em">
						<a href="${link}" target="_blank"><em>${title}</em></a>.
						<p class="single-spacing">${authors}.</p>
						<p class="single-spacing">${pubInfo}.</p>
					</li>`;

			citations += paper.metadata.citation_count || 0;
		});

		output += '</ul>';

		// Calculate h-index
		const citationCounts = allPapers.map(paper => paper.metadata.citation_count || 0);
		citationCounts.sort((a, b) => b - a);
		for (let i = 0; i < citationCounts.length; i++) {
			if (citationCounts[i] >= i + 1) {
				hIndex = i + 1;
			} else {
				break;
			}
		}

		// Update DOM
		document.getElementById('inspire-hep-container').innerHTML = output;
		document.getElementById('laburpena').innerHTML = `
  			A total <span style="white-space: nowrap;">of&nbsp;<span style="font-weight: bold; font-size: 1.1rem">${publications}</span>&nbsp;<b>publications</b></span> 
     			in <span style="white-space: nowrap;">high-impact</span> <span style="white-space: nowrap;">peer-reviewed</span> journals, 
			an <span style="white-space: nowrap;"><b>h-index</b>&nbsp;of&nbsp;<span style="font-weight: bold; font-size: 1.1rem">${hIndex}</span></span>, 
			and <span style="white-space: nowrap;"><span style="font-weight: bold; font-size: 1.1rem">${citations}</span>&nbsp;<b>citations</b></span> 
			demonstrate sustained academic impact.
		`;

	} catch (error) {
		console.error('Error fetching INSPIRE-HEP data:', error);
		document.getElementById('inspire-hep-container').innerHTML = '<p>Error loading publications.</p>';
	}
}

fetchInspireHEP();

const now = new Date();
document.getElementById("date").textContent = "Updated on " + now.toLocaleDateString();


const lastModified = new Date(document.lastModified);
const day = String(lastModified.getDate()).padStart(2, '0');  // Pad single digit day with a leading 0
	const month = String(lastModified.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1 and pad if needed
	const year = lastModified.getFullYear();
const formattedDate = `${day}/${month}/${year}`;
document.getElementById('lastUpdate').textContent = 'Updated on ' + formattedDate;





