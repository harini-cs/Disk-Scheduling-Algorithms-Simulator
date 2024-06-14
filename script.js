function showAlgorithm() {
    const algorithm = document.getElementById('algorithm').value;
    let description = '';

    switch (algorithm) {
        case 'fcfs':
            description = 'First-Come, First-Served (FCFS) scheduling algorithm.';
            break;
        case 'sstf':
            description = 'Shortest Seek Time First (SSTF) scheduling algorithm.';
            break;
        case 'scan':
            description = 'SCAN scheduling algorithm.';
            break;
        case 'cscan':
            description = 'Circular SCAN (C-SCAN) scheduling algorithm.';
            break;
        case 'look':
            description = 'LOOK scheduling algorithm.';
            break;
        case 'clook':
            description = 'Circular LOOK (C-LOOK) scheduling algorithm.';
            break;
    }

    document.getElementById('algorithm-description').innerText = description;
}

function simulate(event) {
    event.preventDefault();

    const algorithm = document.getElementById('algorithm').value;
    const requestsInput = document.getElementById('requests').value;
    const headInput = document.getElementById('head').value;
    const diskSizeInput = document.getElementById('disk-size').value;

    // Convert requests to an array of numbers
    const requests = requestsInput.split(',').map(Number);
    const head = Number(headInput);
    const diskSize = Number(diskSizeInput);

    let result;
    let movements = [];

    switch (algorithm) {
        case 'fcfs':
            result = fcfs(requests, head, movements);
            break;
        case 'scan':
            result = scan(requests, head, movements, diskSize);
            break;
        case 'cscan':
            result = cscan(requests, head, movements, diskSize);
            break;
        case 'look':
            result = look(requests, head, movements, diskSize);
            break;
        case 'clook':
            result = clook(requests, head, movements, diskSize);
            break;
        case 'sstf':
        default:
            result = sstf(requests, head, movements, diskSize);
            break;
    }

    // Display simulation results
    const simulationResult = document.getElementById('simulation-result');
    simulationResult.innerHTML = `<h2>Simulation Results</h2>`;
    simulationResult.innerHTML += `Total head movement: ${result} cylinders<br><br>`;
    simulationResult.innerHTML += `Movements: ${movements.join(' -> ')}`;
}

function fcfs(requests, head, movements) {
    let totalMovement = 0;
    let currentPosition = head;
    movements.push(currentPosition);

    for (let request of requests) {
        totalMovement += Math.abs(currentPosition - request);
        currentPosition = request;
        movements.push(currentPosition);
    }

    return totalMovement;
}

function sstf(requests, head, movements, diskSize) {
    let totalMovement = 0;
    let currentPosition = head;
    movements.push(currentPosition);

    // Create a copy of requests array
    let remainingRequests = [...requests];

    while (remainingRequests.length > 0) {
        // Find closest request to current position
        let shortestDistance = Math.abs(currentPosition - remainingRequests[0]);
        let closestIndex = 0;

        for (let i = 1; i < remainingRequests.length; i++) {
            let distance = Math.abs(currentPosition - remainingRequests[i]);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestIndex = i;
            }
        }

        // Add movement to total and update current position
        totalMovement += shortestDistance;
        currentPosition = remainingRequests[closestIndex];
        movements.push(currentPosition);

        // Remove serviced request from remaining requests
        remainingRequests.splice(closestIndex, 1);
    }

    return totalMovement;
}

function scan(requests, head, movements, diskSize) {
    let totalMovement = 0;
    let currentPosition = head;
    movements.push(currentPosition);

    // Sort requests in ascending order
    const sortedRequests = requests.slice().sort((a, b) => a - b);

    // Find the index where head position would fit in sorted array
    let index = 0;
    while (index < sortedRequests.length && sortedRequests[index] < head) {
        index++;
    }

    // Move right
    for (let i = index; i < sortedRequests.length; i++) {
        totalMovement += Math.abs(currentPosition - sortedRequests[i]);
        currentPosition = sortedRequests[i];
        movements.push(currentPosition);
    }

    // Move left
    totalMovement += Math.abs(currentPosition - diskSize); // Move to the end of the disk
    currentPosition = diskSize;
    movements.push(currentPosition);

    for (let i = index - 1; i >= 0; i--) {
        totalMovement += Math.abs(currentPosition - sortedRequests[i]);
        currentPosition = sortedRequests[i];
        movements.push(currentPosition);
    }

    return totalMovement;
}

function cscan(requests, head, movements, diskSize) {
    const sortedRequests = [...requests].sort((a, b) => a - b);
    let totalMovement = 0;
    let currentPosition = head;
    movements.push(currentPosition);

    for (let i = 0; i < sortedRequests.length; i++) {
        if (sortedRequests[i] >= head) {
            totalMovement += Math.abs(currentPosition - sortedRequests[i]);
            currentPosition = sortedRequests[i];
            movements.push(currentPosition);
        }
    }
    totalMovement += Math.abs(currentPosition - diskSize); // Move to the end of the disk
    currentPosition = diskSize;
    movements.push(currentPosition);
    totalMovement += diskSize; // Move to the start of the disk
    currentPosition = 0;
    movements.push(currentPosition);
    for (let i = 0; i < sortedRequests.length; i++) {
        if (sortedRequests[i] < head) {
            totalMovement += Math.abs(currentPosition - sortedRequests[i]);
            currentPosition = sortedRequests[i];
            movements.push(currentPosition);
        }
    }

    return totalMovement;
}

function look(requests, head, movements, diskSize) {
    let totalMovement = 0;
    let currentPosition = head;
    movements.push(currentPosition);

    // Sort requests in ascending order
    const sortedRequests = requests.slice().sort((a, b) => a - b);

    // Find the index where head position would fit in sorted array
    let index = 0;
    while (index < sortedRequests.length && sortedRequests[index] < head) {
        index++;
    }

    // Move right
    for (let i = index; i < sortedRequests.length; i++) {
        totalMovement += Math.abs(currentPosition - sortedRequests[i]);
        currentPosition = sortedRequests[i];
        movements.push(currentPosition);
    }

    // Move left
    for (let i = index - 1; i >= 0; i--) {
        totalMovement += Math.abs(currentPosition - sortedRequests[i]);
        currentPosition = sortedRequests[i];
        movements.push(currentPosition);
    }

    return totalMovement;
}

function clook(requests, head, movements, diskSize) {
    const sortedRequests = [...requests].sort((a, b) => a - b);
    let totalMovement = 0;
    let currentPosition = head;
    movements.push(currentPosition);

    for (let i = 0; i < sortedRequests.length; i++) {
        if (sortedRequests[i] >= head) {
            totalMovement += Math.abs(currentPosition - sortedRequests[i]);
            currentPosition = sortedRequests[i];
            movements.push(currentPosition);
        }
    }
    for (let i = 0; i < sortedRequests.length; i++) {
        if (sortedRequests[i] < head) {
            totalMovement += Math.abs(currentPosition - sortedRequests[i]);
            currentPosition = sortedRequests[i];
            movements.push(currentPosition);
        }
    }

    return totalMovement;
}

// Function to display the algorithm description based on selection
function showAlgorithm() {
    const algorithm = document.getElementById('algorithm').value;
    let description = '';

    switch (algorithm) {
        case 'fcfs':
            description = 'First-Come, First-Served (FCFS) scheduling algorithm.';
            break;
        case 'sstf':
            description = 'Shortest Seek Time First (SSTF) scheduling algorithm.';
            break;
        case 'scan':
            description = 'SCAN scheduling algorithm.';
            break;
        case 'cscan':
            description = 'Circular SCAN (C-SCAN) scheduling algorithm.';
            break;
        case 'look':
            description = 'LOOK scheduling algorithm.';
            break;
        case 'clook':
            description = 'Circular LOOK (C-LOOK) scheduling algorithm.';
            break;
    }

    document.getElementById('algorithm-description').innerText = description;
}

// Function to simulate disk scheduling based on selected algorithm
function simulate(event) {
    event.preventDefault();

    const algorithm = document.getElementById('algorithm').value;
    const requestsInput = document.getElementById('requests').value;
    const headInput = document.getElementById('head').value;
    const diskSizeInput = document.getElementById('disk-size').value;

    // Convert requests to an array of numbers
    const requests = requestsInput.split(',').map(Number);
    const head = Number(headInput);
    const diskSize = Number(diskSizeInput);

    let result;
    let movements = [];

    switch (algorithm) {
        case 'fcfs':
            result = fcfs(requests, head, movements);
            break;
        case 'scan':
            result = scan(requests, head, movements, diskSize);
            break;
        case 'cscan':
            result = cscan(requests, head, movements, diskSize);
            break;
        case 'look':
            result = look(requests, head, movements, diskSize);
            break;
        case 'clook':
            result = clook(requests, head, movements, diskSize);
            break;
        case 'sstf':
        default:
            result = sstf(requests, head, movements, diskSize);
            break;
    }

    // Display simulation results
    const simulationResult = document.getElementById('simulation-result');
    simulationResult.innerHTML = `<h2>Simulation Results</h2>`;
    simulationResult.innerHTML += `Total head movement: ${result} cylinders<br><br>`;
    simulationResult.innerHTML += `Movements: ${movements.join(' -> ')}`;
}
