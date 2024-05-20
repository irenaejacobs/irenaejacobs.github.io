let chart;

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value.replace(/,/g, ''));
    const annualRate = parseFloat(document.getElementById('rate').value.replace(/,/g, '')) / 100;
    const compoundingFrequency = document.getElementById('frequency').value;
    const years = parseFloat(document.getElementById('years').value.replace(/,/g, ''));
    const contribution = parseFloat(document.getElementById('contribution').value.replace(/,/g, ''));

    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || isNaN(contribution)) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        return;
    }

    let futureValue;
    let totalInterest;
    let totalContributions = 0;

    const data = [];
    let amount = principal;

    if (compoundingFrequency === "Continuous") {
        for (let t = 0; t <= years; t += 1) {
            futureValue = (principal * Math.exp(annualRate * t)) + (contribution * ((Math.exp(annualRate * t) - 1) / annualRate));
            totalContributions = contribution * t;
            totalInterest = futureValue - principal - totalContributions;
            data.push({ period: t, amount: futureValue, principal: principal, contributions: totalContributions, interest: totalInterest });
        }
    } else {
        const n = parseInt(compoundingFrequency);
        const totalPeriods = years * n;
        const periodRate = annualRate / n;

        for (let i = 0; i <= totalPeriods; i++) {
            if (i > 0) {
                amount += contribution;
                totalContributions += contribution;
                amount *= (1 + periodRate);
            }
            totalInterest = amount - principal - totalContributions;
            data.push({ period: i, amount: amount, principal: principal, contributions: totalContributions, interest: totalInterest });
        }
    }

    futureValue = amount;
    totalInterest = futureValue - principal - totalContributions;

    document.getElementById('result').innerHTML = `
        Future Value: ${formatCurrency(futureValue)}<br>
        Principal: ${formatCurrency(principal)}<br>
        Total Contributions: ${formatCurrency(totalContributions)}<br>
        Interest Earned: ${formatCurrency(totalInterest)}
    `;

    drawChart(data);
    populateTable(data);

    // Show the export button and output table
    document.getElementById('exportButton').style.display = 'block';
    document.getElementById('outputTable').style.display = 'table';
}

function drawChart(data) {
    const ctx = document.getElementById('interestChart').getContext('2d');
    const labels = data.map(d => d.period);
    const principals = data.map(d => d.principal);
    const contributions = data.map(d => d.contributions);
    const interest = data.map(d => d.interest);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Principal',
                    data: principals,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Contributions',
                    data: contributions,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Interest',
                    data: interest,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Periods'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function populateTable(data) {
    const tbody = document.getElementById('outputTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear previous table data
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.period}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.contributions)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.amount)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatInput(event) {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(value) && value !== '') {
        event.target.value = formatNumber(parseFloat(value));
    }
}

function exportTableToExcel() {
    const table = document.getElementById('outputTable');
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, 'compound_interest.xlsx');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', calculateCompoundInterest);
    document.getElementById('exportButton').addEventListener('click', exportTableToExcel);

    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('blur', formatInput);
    });
});
// Existing compound interest calculator code remains the same...

function calculateMortgage() {
    const homeValue = parseFloat(document.getElementById('homeValue').value.replace(/,/g, ''));
    const downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, '')) / 100;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, '')) / 100;
    const startMonth = parseInt(document.getElementById('startMonth').value);
    const startYear = parseInt(document.getElementById('startYear').value);

    if (isNaN(homeValue) || isNaN(downPayment) || isNaN(loanTerm) || isNaN(interestRate) || isNaN(startMonth) || isNaN(startYear)) {
        document.getElementById('mortgageResult').innerText = "Please enter valid numbers.";
        return;
    }

    const loanAmount = homeValue * (1 - downPayment);
    const monthlyRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

    const data = [];
    let remainingBalance = loanAmount;
    let totalInterestPaid = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        totalInterestPaid += interestPayment;

        data.push({
            period: i,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            remainingBalance: remainingBalance
        });
    }

    document.getElementById('mortgageResult').innerHTML = `
        Monthly Payment: ${formatCurrency(monthlyPayment)}<br>
        Total Interest Paid: ${formatCurrency(totalInterestPaid)}<br>
        Total Paid: ${formatCurrency(totalInterestPaid + loanAmount)}
    `;

    populateMortgageTable(data);

    // Show the export button and output table
    document.getElementById('exportMortgageButton').style.display = 'block';
    document.getElementById('mortgageTable').style.display = 'table';
}

function populateMortgageTable(data) {
    const tbody = document.getElementById('mortgageTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear previous table data
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.period}</td>
            <td>${formatCurrency(row.payment)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.remainingBalance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportTableToExcel() {
    const table = document.querySelector('table:visible');
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, 'amortization_schedule.xlsx');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateMortgageButton').addEventListener('click', calculateMortgage);
    document.getElementById('exportMortgageButton').addEventListener('click', exportTableToExcel);

    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('blur', formatInput);
    });
});
