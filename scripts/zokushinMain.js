class GlobalManager {
	constructor() {
		this.outarea = document.getElementById("OUTAREA");
		this.checkbox = document.getElementById('CHECKBOX');
		this.info = document.getElementById('INFO');
		this.numberOfColumns = (window.innerWidth < 768) ? 1 : 5;
		this.currentCategory = 3;
		this.ENTRY = 0;
		this.YOMI = 1;
		this.PAGE = 2;
		this.JINGI = 3;
		this.SHAKKYOU = 4;
		this.EKIREKI = 5;
		this.SAIJI = 6;
		this.JUGAN = 7;
		this.YOUI = 8;
	}
}
const G = new GlobalManager();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const LocalFlag = (urlParams.get('env') === 'local') ? true : false ;

const removeVoicing = s => s.normalize('NFD').replace(/[\u3099\u309A]/g, '');

function createDirectory(category, outareaTag, columnMax) {
	const outarea = document.getElementById(outareaTag);
	outarea.innerHTML = '';
	const header = document.createElement('h3');
	header.innerHTML = `${bookData[0][category]}`
	outarea.appendChild(header);
	let breakKey = '';
	const table = document.createElement('table');
	outarea.appendChild(table);
	let columnCounter = columnMax;
	let row;
	for (let idx = 1; idx < bookData.length; idx++) {
		if (bookData[idx][category] !== '*')  continue;
		let yomi = removeVoicing(bookData[idx][G.YOMI].substring(0, 1));
		if (yomi === breakKey)  continue;
		breakKey = yomi;
		if (++columnCounter > columnMax) {
			row = table.insertRow();
			columnCounter = 1;
		}
		const cell = row.insertCell();
		cell.innerHTML = `<a href="javascript:createTOC('${category}', '${yomi}', '${outareaTag}')" >${yomi}</a>&nbsp;`;
	}
}

function createTOC(category, char, outareaTag) {
	const outarea = document.getElementById(outareaTag);
	outarea.innerHTML = '';
	const header = document.createElement('h3');
	header.innerHTML = `${bookData[0][category]}`
	outarea.appendChild(header);
	const table = document.createElement('table');
	table.style.border = '1px solid black';
	table.style.width = '100%';
	outarea.appendChild(table);
	const columnMax = G.numberOfColumns;
	let columnCounter = columnMax;
	let row;
	for (let idx = 1; idx < bookData.length; idx++) {
		let yomi = removeVoicing(bookData[idx][G.YOMI].substring(0, 1));
		if ((bookData[idx][category] === '*') && ((char === '') || (yomi === char))) {
			if (++columnCounter > columnMax) {
				row = table.insertRow();
				columnCounter = 1;
			}
			const cell = row.insertCell();
			cell.style.border = '1px solid black';
			const entry = bookData[idx];
			cell.innerHTML = `<a href="javascript:openPage(${bookData[idx][G.PAGE]})" >${entry[G.ENTRY]}（${entry[G.YOMI]}）</a>`;
			
		}
	}
}

function openPage(page) {
	const frame = Math.floor(page / 2) + metaInfo['OFFSET'];
	console.log(`open frame: ${frame}`);
	openFrame(frame);
}

createDirectory(G.JINGI, 'OUTAREA', 5);

function pick(el) {
	document.querySelectorAll('#g1 .seg-size-btn').forEach(b => b.classList.remove('active'));
	el.classList.add('active');
	let val;
	switch (el.textContent) {
		case '神祇' :
			val = 3;
			break;
		case '釈教' :
			val = 4;
			break;
		case '易暦' :
			val = 5;
			break;
		case '歳時' :
			val = 6;
			break;
		case '呪願' :
			val = 7;
			break;
		case '妖異' :
			val = 8;
			break;
		default :
	}
	G.currentCategory = val;
	check();
}

function check() {
	if (G.checkbox.checked) {
		createDirectory(G.currentCategory, 'OUTAREA', 5);
	} else {
		createTOC(G.currentCategory, '', 'OUTAREA');
	}
}

function openFrame(frame, title='結果') {
	if (frame === 0) return;
	if (LocalFlag) {
		window.open(metaInfo['PATH']+frame, title);
	} else {
		window.open(metaInfo['URL']+frame, title);
	}
	G.info.selectedIndex = 0;
}
