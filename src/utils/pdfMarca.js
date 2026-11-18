import EMPRESA from '../config/empresa'

// Cores da marca (mesmas de src/index.css)
const BRAND = [15, 76, 92]
const BRAND_BRIGHT = [20, 184, 166]
const ACCENT = [242, 165, 65]

function resetarEstilo(doc) {
  doc.setTextColor(0, 0, 0)
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.2)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
}

// Cabeçalho desenhado no topo da página (0–32 mm)
export function desenharCabecalho(doc, t = (s) => s) {
  doc.setFillColor(...BRAND)
  doc.rect(0, 0, 210, 30, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 30, 210, 1.5, 'F')

  // Símbolo: quadrado arredondado com um "V"
  doc.setFillColor(...BRAND_BRIGHT)
  doc.roundedRect(12, 7, 16, 16, 3, 3, 'F')
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(1.6)
  doc.line(15.5, 11, 20, 19.5)
  doc.line(20, 19.5, 24.5, 11)
  doc.setFillColor(...ACCENT)
  doc.circle(20, 11, 1.3, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(EMPRESA.nome, 33, 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`${EMPRESA.nomeCompleto} · ${t('Recursos Humanos')}`, 33, 21)

  resetarEstilo(doc)
}

// Rodapé desenhado na base da página (287–297 mm)
export function desenharRodape(doc, t = (s) => s) {
  doc.setFillColor(...BRAND)
  doc.rect(0, 287, 210, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`${EMPRESA.nomeCompleto} · ${t('Documento de uso interno')}`, 105, 293, { align: 'center' })

  resetarEstilo(doc)
}

// Título de seção ("1 - DADOS PESSOAIS ———"): texto alinhado à esquerda e a linha
// começando logo após o texto, medido em tempo real (funciona com qualquer idioma)
export function desenharTituloSecao(doc, texto, y, { x = 12, fim = 196, espaco = 3 } = {}) {
  doc.text(texto, x, y)
  doc.line(x + doc.getTextWidth(texto) + espaco, y - 1.5, fim, y - 1.5)
}
