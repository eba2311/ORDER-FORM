document.addEventListener('DOMContentLoaded', () => {
    // Select all inputs that affect calculations
    const rows = document.querySelectorAll('#lineItems tr');
    const taxRateIntInput = document.getElementById('taxRateInt');
    const taxRateDecSelect = document.getElementById('taxRateDec');
    const shippingInput = document.getElementById('shipping');
    const subtotalInput = document.getElementById('subtotal');
    const salesTaxInput = document.getElementById('salesTax');
    const grandTotalInput = document.getElementById('grandTotal');

    // Helper to format currency
    const formatCurrency = (amount) => {
        return amount.toFixed(2);
    };

    // Calculate Row Total
    const calculateRow = (row) => {
        const qtyInput = row.querySelector('.qty');
        const priceInput = row.querySelector('.price');
        const totalInput = row.querySelector('.row-total');

        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;

        // Calculate and round to 2 decimals to ensure "what you see is what you sum"
        const totalRaw = qty * price;
        const totalRounded = Math.round(totalRaw * 100) / 100;

        totalInput.value = formatCurrency(totalRounded);
        return totalRounded;
    };

    // Main calculation function
    const calculateAll = () => {
        let subtotal = 0;

        // Calculate rows and sum subtotal
        rows.forEach(row => {
            subtotal += calculateRow(row);
        });

        // Round subtotal again to be safe (though sum of rounded numbers should be clean, JS floats can be weird)
        subtotal = Math.round(subtotal * 100) / 100;

        // Update Subtotal Field
        subtotalInput.value = formatCurrency(subtotal);

        // Calculate Tax
        const taxInt = parseFloat(taxRateIntInput.value) || 0;
        const taxDec = parseFloat(taxRateDecSelect.value) || 0;

        // Combine e.g. 8 and 25 to make 8.25%
        const taxRate = (taxInt + (taxDec / 100)) / 100;

        let taxAmount = subtotal * taxRate;
        taxAmount = Math.round(taxAmount * 100) / 100; // Round tax to 2 decimals

        salesTaxInput.value = formatCurrency(taxAmount);

        // Calculate Grand Total
        const shipping = parseFloat(shippingInput.value) || 0;
        const grandTotal = subtotal + taxAmount + shipping;

        grandTotalInput.value = '$' + formatCurrency(grandTotal);
    };

    // Attach Event Listeners
    rows.forEach(row => {
        const qty = row.querySelector('.qty');
        const price = row.querySelector('.price');

        qty.addEventListener('input', calculateAll);
        price.addEventListener('input', calculateAll);
    });

    taxRateIntInput.addEventListener('input', calculateAll);
    taxRateDecSelect.addEventListener('change', calculateAll);
    shippingInput.addEventListener('input', calculateAll);

    // Initial Calculation
    calculateAll();
});
