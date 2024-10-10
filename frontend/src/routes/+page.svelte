<script lang="ts">
	import Papa from 'papaparse';
	import axios from 'axios';
	import { onMount } from 'svelte';

	let file: File | null = null;
	let data = []; // Stores fetched data
	let currentPage = 1;
	let rowsPerPage = 10;
	let totalPages = 1; // Keep track of total pages

	let loading = false; // Track loading state

	let errorMsg = false;
	let searchQuery = '';

	// Handle file selection
	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			file = input.files[0];
			console.log('File: ', file);
		}
	}

	// Convert CSV to JSON and send to the backend
	async function uploadCSV() 
	{
		if (file) {
			console.log('File is true');
			Papa.parse(file, {
				header: true,
				complete: async function (results) {
					try {
						let dataSend = results.data;

						// Filter out any entries with an empty postId or other required fields
						//dataSend = dataSend.filter(record => record.postId && record.id && record.name && record.email && record.body);

						console.log('CSV data:', dataSend);

						// Send the JSON data directly to the backend without wrapping in 'data'
						let response = await axios.post(
							'http://localhost:3000/api/upload',
							dataSend, // Send the array directly
							{
								headers: {
									'Content-Type': 'application/json'
								}
							}
						);
						console.log(response);
						if (response.status === 200) {
							errorMsg = false;
							console.log('Csv file is uploaded successfully');
							// Clear the file input after upload
							file = null;
							const inputElement = document.querySelector('input[type="file"]');
							if (inputElement) {
								inputElement.value = ''; // Clear the file input field
							}
						}
						fetchData();
					} catch (error) {
						console.error('Error uploading CSV:', error);
					}
				}
			});
		}
	}

	// Fetch data from the backend using POST request with pagination parameters in the body
	async function fetchData(page: number = 1) {
		loading = true; // Start loading
		try {
			const response = await axios.post('http://localhost:3000/api/data', {
				page: page,
				limit: rowsPerPage
			});
			if (response.status === 200) {
				data = response.data.records; // Fetch the records from the response
				currentPage = response.data.page; // Set the current page
				loading = false;
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	async function searchData() {
		const inputdata = searchQuery;
		try {
			const response = await axios.post('http://localhost:3000/api/search', {
				data: inputdata,
				page: currentPage, // pass in the current page
				limit: rowsPerPage
			});
			if (response.status === 200) {
				console.log(response.data);
				data = response.data.records; // Fetch the records from the response
				currentPage = response.data.page; // Set the current page
				totalPages = response.data.totalPages; // Set the total pages
				loading = false;
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			loading = false;
		}
	}

	onMount(() => {
		fetchData(); // Fetch initial data on mount
	});

	// // Pagination controls
	function goToNextPage()
	 {
		currentPage++;
		fetchData(currentPage);
	}

	function goToPreviousPage() {
		if (currentPage > 1) 
		{
			currentPage--;
			fetchData(currentPage);
		}
	}
</script>

<main>
	<h1>Mini Assignment</h1>
	<input type="file" accept=".csv" data-testid="fileSelect" on:change={handleFileUpload} />
	<button on:click={uploadCSV} name="upload">Upload</button>
	{#if errorMsg}
		<div class="errorMessage"><p>Insert a csv file</p></div>
	{/if}

	<h3>Data Table</h3>
	{#if loading === true}
		<p>Data is loading...</p>
	{/if}

	<!-- Search Box -->
	<div class="searchBox">
		<input type="text" placeholder="Search..." bind:value={searchQuery} on:input={searchData} />
	</div>

	{#if loading == false}
		<table>
			<thead>
				<tr>
					<th>PostId</th>
					<th>id</th>
					<th>Name</th>
					<th>Email</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{#each data as post}
					<tr>
						<td>{post.postId}</td>
						<td>{post.id}</td>
						<td>{post.email}</td>
						<td>{post.email}</td>
						<td>{post.body}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="btnGrp">
			<button on:click={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
			<span>Page {currentPage}</span>
			<button on:click={goToNextPage}>Next</button>
		</div>
	{/if}
</main>

<style>
	table {
		width: 100%;
		border-collapse: collapse; /* Ensures borders collapse into a single line */
	}

	th,
	td {
		border: 1px solid #ddd; /* Adds lines around the table */
		padding: 8px; /* Adds padding inside cells */
		text-align: left; /* Align text to the left */
	}

	th {
		background-color: #f2f2f2; /* Light gray background for table headers */
		font-weight: bold; /* Makes headers bold */
	}

	tr:nth-child(even) {
		background-color: #f9f9f9; /* Alternating row background color for readability */
	}

	tr:hover {
		background-color: #f1f1f1; /* Highlight row when hovered */
	}

	.errorMessage {
		color: red;
	}

	/* Button styles */
	button {
		background-color: #007bff; /* Blue color */
		color: white; /* White text */
		border: none; /* Removes default border */
		padding: 10px 20px; /* Padding inside the button */
		border-radius: 20px; /* Round edges */
		cursor: pointer; /* Changes cursor to pointer */
		font-size: 16px; /* Font size */
		transition: background-color 0.3s ease; /* Smooth transition on hover */
	}

	button:hover {
		background-color: #0056b3; /* Darker blue on hover */
	}

	button:disabled {
		background-color: #dcdcdc; /* Gray color when button is disabled */
		cursor: not-allowed; /* Disabled cursor */
	}

	.btnGrp {
		padding: 10px;
	}

	.searchBox {
		padding: 10px;
	}
</style>
