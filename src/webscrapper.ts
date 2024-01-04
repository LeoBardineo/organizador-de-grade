import axios, { AxiosError } from 'axios'
import { JSDOM } from 'jsdom'

const URL_GRADE = "https://www.siga.ufrj.br/sira/inscricao/GradeHoraria.jsp?distribuicaoCurricular_oid=402FED54-92A4-F79C-3ACF-54A4EA89ED35"
const materias:Materia[] = []

axios.get(URL_GRADE)
    .then(res => res.data)
    .then(html => {
        const dom = new JSDOM(html)
        dom.window.document.querySelectorAll('.lineBorder').forEach(tabela => {
            tabela.querySelectorAll('tr').forEach(tr => {
                const id = tr.querySelector('td:nth-child(1)')?.textContent?.trim()
                const nome = tr.querySelector('td:nth-child(2)')?.textContent?.trim()
                const horarios = tr.querySelector('td:nth-child(4)')?.textContent?.trim()
                if(id === undefined || nome === undefined || horarios === undefined) return
                const horariosMateria = horarios.split(/\s\s+/g)
                const gradeMateria: Materia = {
                    id,
                    nome,
                    horarios: []
                }

                horariosMateria.forEach(horario => {
                    const dia = horario.substring(0, 3).toLowerCase() as DiaDaSemana
                    const hInicial = parseInt(horario.substring(5, 7))
                    const horas = parseInt(horario.substring(14, 16)) - hInicial
                    
                    gradeMateria.horarios.push({dia, hInicial, horas })
                })

                console.log(gradeMateria.id)
                console.log(gradeMateria.nome)
                console.log(gradeMateria.horarios)
                console.log('===========')
                materias.push(gradeMateria)
            })
        })
    })
    .catch((error: AxiosError) => {
        console.log(error.toJSON())
    })