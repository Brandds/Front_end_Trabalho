
import { deleteData, fetchData, postData, putData } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const navButtons = document.querySelectorAll('header nav button');

    const veiculosSection = document.getElementById('section-veiculos');
    const veiculosTableBody = document.getElementById('table-veiculos').querySelector('tbody');
    const modalVeiculo = document.getElementById('modal-veiculo');
    const formVeiculo = document.getElementById('form-veiculo');
    
    const clientesSection = document.getElementById('section-clientes');
    const clientesTableBody = document.getElementById('table-clientes').querySelector('tbody');
    const modalCliente = document.getElementById('modal-cliente');
    const formCliente = document.getElementById('form-cliente');
    
    const alugueisSection = document.getElementById('section-alugueis');
    const alugueisTableBody = document.getElementById('table-alugueis').querySelector('tbody');
    const modalAluguel = document.getElementById('modal-aluguel');
    const formAluguel = document.getElementById('form-aluguel');
    
    const fabricantesSection = document.getElementById('section-fabricantes');
    const fabricantesTableBody = document.getElementById('table-fabricantes').querySelector('tbody');
    const modalFabricante = document.getElementById('modal-fabricante');
    const formFabricante = document.getElementById('form-fabricante');

    const sections = {
        'nav-veiculos': { element: veiculosSection, loader: loadVeiculos },
        'nav-clientes': { element: clientesSection, loader: loadClientes },
        'nav-alugueis': { element: alugueisSection, loader: loadAlugueis },
        'nav-fabricantes': { element: fabricantesSection, loader: loadFabricantes },
    };

    function switchTab(targetId) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');

        Object.values(sections).forEach(sec => sec.element.classList.remove('active'));
        sections[targetId].element.classList.add('active');
        sections[targetId].loader();
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.id));
    });

    async function loadVeiculos() {
        const modelo = document.getElementById('filtro-veiculo-modelo').value;
        const fabricanteId = document.getElementById('filtro-veiculo-fabricanteId').value;
        const params = new URLSearchParams();
        if (modelo) params.append('modelo', modelo);
        if (fabricanteId) params.append('fabricanteId', fabricanteId);

        let veiculos = await fetchData(`Veiculos?${params.toString()}`);
        if (veiculos && veiculos.$values) {
            veiculos = veiculos.$values;
        }
        renderTable(veiculosTableBody, veiculos, renderVeiculoRow);
    }

    function renderVeiculoRow(veiculo) {
        return `
            <td>${veiculo.iD_Veiculo}</td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.ano}</td>
            <td>${veiculo.fabricante?.nome || 'N/A'}</td>
            <td>${veiculo.quilomentragens}</td>
            <td>
                <button class="btn-edit" data-id="${veiculo.iD_Veiculo}" data-type="veiculo">Editar</button>
                <button class="btn-delete" data-id="${veiculo.iD_Veiculo}" data-type="veiculo">Excluir</button>
            </td>
        `;
    }
    
    formVeiculo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = e.target['veiculo-id'].value;
        const data = {
            modelo: e.target['veiculo-modelo'].value,
            ano: parseInt(e.target['veiculo-ano'].value),
            quilomentragens: parseInt(e.target['veiculo-km'].value),
            iD_Fabricante: parseInt(e.target['veiculo-fabricante-id'].value),
        };
        
        if (id) {
            data.iD_Veiculo = parseInt(id);
            await putData('Veiculos', id, data);
        } else {
            await postData('Veiculos', data);
        }
        
        modalVeiculo.close();
        loadVeiculos();
    });

    async function loadClientes() {
        const nome = document.getElementById('filtro-cliente-nome').value;
        const email = document.getElementById('filtro-cliente-email').value;
        const params = new URLSearchParams();
        if (nome) params.append('nome', nome);
        if (email) params.append('email', email);

        let clientes = await fetchData(`Clientes?${params.toString()}`);
        if (clientes && clientes.$values) {
            clientes = clientes.$values;
        }
        renderTable(clientesTableBody, clientes, renderClienteRow);
    }

    function renderClienteRow(cliente) {
        return `
            <td>${cliente.iD_Cliente}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>
                <button class="btn-edit" data-id="${cliente.iD_Cliente}" data-type="cliente">Editar</button>
                <button class="btn-delete" data-id="${cliente.iD_Cliente}" data-type="cliente">Excluir</button>
            </td>
        `;
    }

    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = e.target['cliente-id'].value;
        const data = {
            nome: e.target['cliente-nome'].value,
            email: e.target['cliente-email'].value,
            telefone: e.target['cliente-telefone'].value,
        };
        
        if (id) {
            data.iD_Cliente = parseInt(id);
            await putData('Clientes', id, data);
        } else {
            await postData('Clientes', data);
        }
        
        modalCliente.close();
        loadClientes();
    });

    async function loadAlugueis() {
        let alugueis = await fetchData('Alugueis');
        if (alugueis && alugueis.$values) {
            alugueis = alugueis.$values;
        }
        renderTable(alugueisTableBody, alugueis, renderAluguelRow);
    }

    function renderAluguelRow(aluguel) {
        const veiculoDesc = `${aluguel.veiculo?.modelo || 'Veículo Inválido'} (${aluguel.veiculo?.fabricante?.nome || 'N/A'})`;
        return `
            <td>${aluguel.iD_Aluguel}</td>
            <td>${aluguel.cliente?.nome || 'Cliente Inválido'}</td>
            <td>${veiculoDesc}</td>
            <td>${new Date(aluguel.data_Inicio).toLocaleDateString('pt-BR')}</td>
            <td>${new Date(aluguel.data_Fim).toLocaleDateString('pt-BR')}</td>
            <td>R$ ${aluguel.valor_Total.toFixed(2)}</td>
            <td>
                <button class="btn-edit" data-id="${aluguel.iD_Aluguel}" data-type="aluguel">Editar</button>
                <button class="btn-delete" data-id="${aluguel.iD_Aluguel}" data-type="aluguel">Excluir</button>
            </td>
        `;
    }
    
    async function populateAluguelFormSelects(selectedAluguel = null) {
        let [clientes, veiculos] = await Promise.all([fetchData('Clientes'), fetchData('Veiculos')]);
        
        if (clientes && clientes.$values) clientes = clientes.$values;
        if (veiculos && veiculos.$values) veiculos = veiculos.$values;

        const clienteSelect = document.getElementById('aluguel-cliente');
        const veiculoSelect = document.getElementById('aluguel-veiculo');

        clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>' + clientes.map(c => `<option value="${c.iD_Cliente}">${c.nome}</option>`).join('');
        veiculoSelect.innerHTML = '<option value="">Selecione um veículo...</option>' + veiculos.map(v => `<option value="${v.iD_Veiculo}">${v.modelo} (${v.fabricante?.nome})</option>`).join('');

        if (selectedAluguel) {
            clienteSelect.value = selectedAluguel.iD_Cliente;
            veiculoSelect.value = selectedAluguel.iD_Veiculo;
        }
    }

    formAluguel.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = e.target['aluguel-id'].value;
        const data = {
            iD_Cliente: parseInt(e.target['aluguel-cliente'].value),
            iD_Veiculo: parseInt(e.target['aluguel-veiculo'].value),
            data_Inicio: e.target['aluguel-data-inicio'].value,
            data_Fim: e.target['aluguel-data-fim'].value,
            valor_Total: parseFloat(e.target['aluguel-valor'].value)
        };
        
        if (id) {
            data.iD_Aluguel = parseInt(id);
            await putData('Alugueis', id, data);
        } else {
            await postData('Alugueis', data);
        }
        
        modalAluguel.close();
        loadAlugueis();
    });

    async function loadFabricantes() {
        let fabricantes = await fetchData('Fabricantes');
        if (fabricantes && fabricantes.$values) {
            fabricantes = fabricantes.$values;
        }
        renderTable(fabricantesTableBody, fabricantes, renderFabricanteRow);
    }

    function renderFabricanteRow(fabricante) {
        return `
            <td>${fabricante.iD_Fabricante}</td>
            <td>${fabricante.nome}</td>
            <td>
                <button class="btn-edit" data-id="${fabricante.iD_Fabricante}" data-type="fabricante">Editar</button>
                <button class="btn-delete" data-id="${fabricante.iD_Fabricante}" data-type="fabricante">Excluir</button>
            </td>
        `;
    }
    
    formFabricante.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = e.target['fabricante-id'].value;
        const data = {
            nome: e.target['fabricante-nome'].value,
        };
        
        if (id) {
            data.iD_Fabricante = parseInt(id);
            await putData('Fabricantes', id, data);
        } else {
            await postData('Fabricantes', data);
        }
        
        modalFabricante.close();
        loadFabricantes();
    });


    function renderTable(tbody, data, rowRenderer) {
        tbody.innerHTML = '';
        if (data && data.length > 0) {
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = rowRenderer(item);
                tbody.appendChild(tr);
            });
        } else {
            const colCount = tbody.closest('table').querySelector('thead th').length;
            tbody.innerHTML = `<tr><td colspan="${colCount}">Nenhum dado encontrado.</td></tr>`;
        }
    }

    document.getElementById('btn-novo-veiculo').addEventListener('click', () => {
        formVeiculo.reset();
        document.getElementById('veiculo-id').value = '';
        document.getElementById('modal-veiculo-title').textContent = 'Novo Veículo';
        modalVeiculo.showModal();
    });
    document.getElementById('btn-novo-cliente').addEventListener('click', () => {
        formCliente.reset();
        document.getElementById('cliente-id').value = '';
        document.getElementById('modal-cliente-title').textContent = 'Novo Cliente';
        modalCliente.showModal();
    });
    document.getElementById('btn-novo-aluguel').addEventListener('click', () => {
        formAluguel.reset();
        document.getElementById('aluguel-id').value = '';
        document.getElementById('modal-aluguel-title').textContent = 'Novo Aluguel';
        populateAluguelFormSelects();
        modalAluguel.showModal();
    });
    document.getElementById('btn-novo-fabricante').addEventListener('click', () => {
        formFabricante.reset();
        document.getElementById('fabricante-id').value = '';
        document.getElementById('modal-fabricante-title').textContent = 'Novo Fabricante';
        modalFabricante.showModal();
    });
    
    document.querySelectorAll('.btn-cancel').forEach(button => {
        const modalId = button.dataset.modalId;
        if (modalId) {
            button.addEventListener('click', () => {
                document.getElementById(modalId).close();
            });
        }
    });

    document.getElementById('btn-filtrar-veiculos').addEventListener('click', loadVeiculos);
    document.getElementById('btn-filtrar-clientes').addEventListener('click', loadClientes);
    
    main.addEventListener('click', async (e) => {
        const target = e.target;
        if (!target.classList.contains('btn-edit') && !target.classList.contains('btn-delete')) return;

        const id = target.dataset.id;
        const type = target.dataset.type;
        
        const config = {
            veiculo:    { endpoint: 'Veiculos',    loader: loadVeiculos },
            cliente:    { endpoint: 'Clientes',    loader: loadClientes },
            aluguel:    { endpoint: 'Alugueis',    loader: loadAlugueis },
            fabricante: { endpoint: 'Fabricantes', loader: loadFabricantes },
        };
        const currentConfig = config[type];
        if (!currentConfig) return;

        if (target.classList.contains('btn-delete')) {
            if (confirm(`Tem certeza que deseja excluir o ${type} com ID ${id}?`)) {
                try {
                    await deleteData(currentConfig.endpoint, id);
                    currentConfig.loader();
                } catch (error) {
                    alert(`Não foi possível excluir. Verifique se este item não está sendo usado em um aluguel.`);
                }
            }
        }

        if (target.classList.contains('btn-edit')) {
            const data = await fetchData(`${currentConfig.endpoint}/${id}`);
            if (!data) return;
            
            if (type === 'veiculo') {
                formVeiculo['veiculo-id'].value = data.iD_Veiculo;
                formVeiculo['veiculo-modelo'].value = data.modelo;
                formVeiculo['veiculo-ano'].value = data.ano;
                formVeiculo['veiculo-km'].value = data.quilomentragens;
                formVeiculo['veiculo-fabricante-id'].value = data.iD_Fabricante;
                document.getElementById('modal-veiculo-title').textContent = 'Editar Veículo';
                modalVeiculo.showModal();
            } else if (type === 'cliente') {
                formCliente['cliente-id'].value = data.iD_Cliente;
                formCliente['cliente-nome'].value = data.nome;
                formCliente['cliente-email'].value = data.email;
                formCliente['cliente-telefone'].value = data.telefone;
                document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
                modalCliente.showModal();
            } else if (type === 'aluguel') {
                formAluguel['aluguel-id'].value = data.iD_Aluguel;
                formAluguel['aluguel-data-inicio'].value = data.data_Inicio.split('T')[0];
                formAluguel['aluguel-data-fim'].value = data.data_Fim.split('T')[0];
                formAluguel['aluguel-valor'].value = data.valor_Total;
                document.getElementById('modal-aluguel-title').textContent = 'Editar Aluguel';
                await populateAluguelFormSelects(data);
                modalAluguel.showModal();
            } else if (type === 'fabricante') {
                formFabricante['fabricante-id'].value = data.iD_Fabricante;
                formFabricante['fabricante-nome'].value = data.nome;
                document.getElementById('modal-fabricante-title').textContent = 'Editar Fabricante';
                modalFabricante.showModal();
            }
        }
    });

    switchTab('nav-veiculos'); 
});
