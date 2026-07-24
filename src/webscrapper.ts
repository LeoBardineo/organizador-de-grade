import axios, { AxiosError } from 'axios'
import { JSDOM } from 'jsdom'
import fs from 'fs'

type DiaDaSemana = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

interface Horario {
  dia: DiaDaSemana;
  hInicial: number;
  horas: number;
}

interface Periodo {
    [key: string]: Materia[];
}

interface Materia {
  id: string;
  nome: string;
  horarios: Horario[];
}

const URL_GRADE = "https://www.siga.ufrj.br/sira/inscricao/GradeHoraria.jsp?distribuicaoCurricular_oid=402FED54-92A4-F79C-3ACF-54A4EA89ED35";

(async () => {
    const periodos:Periodo = {}
    const html = await (await axios.get(URL_GRADE,
        {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }
    )).data.toString('latin1')
    const dom = new JSDOM(html)
    dom.window.document.querySelectorAll('.lineBorder').forEach(tabela => {
        const materias:Materia[] = [];
        const periodo = tabela.previousElementSibling?.querySelector('a > b')?.innerHTML
        // console.log(periodo)
        if(periodo === undefined) return;
        tabela.querySelectorAll('tr').forEach(trMateria => {
            const id = trMateria.querySelector('td:nth-child(1)')?.textContent?.trim()
            const nome = trMateria.querySelector('td:nth-child(2)')?.textContent?.trim()
            const horarios = trMateria.querySelector('td:nth-child(4)')?.textContent?.trim()
            if(id === undefined || nome === undefined || horarios === undefined) return
            const horariosMateria = horarios.split(/\s\s+/g)

            const gradeMateria: Materia = {
                id,
                nome,
                horarios: [],
            }

            horariosMateria.forEach(horario => {
                const dia = horario.substring(0, 3).toLowerCase() as DiaDaSemana
                const hInicial = parseInt(horario.substring(5, 7))
                const horas = parseInt(horario.substring(14, 16)) - hInicial
                
                gradeMateria.horarios.push({dia, hInicial, horas })
            })

            // console.log(gradeMateria.id)
            // console.log(gradeMateria.nome)
            // console.log(gradeMateria.horarios)
            // console.log('===========')
            materias.push(gradeMateria)
        })

        materias.forEach(materia1 => {
            const quantidadeIdRepetido = materias.filter(materia2 => materia1.id === materia2.id).length
            if(quantidadeIdRepetido <= 1) return
            const novoId = materia1.id + '.' + quantidadeIdRepetido
            materia1.id = novoId
        })

        periodos[periodo] = materias
    })
    fs.writeFile('./.cache/materias.json', JSON.stringify(periodos, null, '\t'), 'utf-8', () => console.log('Webscrapped :)'))
})()
