import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AdminDashboard = () => {
    const salesChartRef = useRef(null);
    const ordersChartRef = useRef(null);
    const salesChartInstance = useRef(null);
    const ordersChartInstance = useRef(null);

    useEffect(() => {
        const salesCtx = salesChartRef.current.getContext('2d');
        const ordersCtx = ordersChartRef.current.getContext('2d');

        // Destroy charts if they exist
        if (salesChartInstance.current) salesChartInstance.current.destroy();
        if (ordersChartInstance.current) ordersChartInstance.current.destroy();

        // Sales Chart
        salesChartInstance.current = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [12000, 15000, 14000, 17000, 18000, 19000, 20000, 22000],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'top' },
                },
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        // Orders Chart
        ordersChartInstance.current = new Chart(ordersCtx, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                datasets: [
                    {
                        label: 'Orders',
                        data: [500, 600, 750, 800, 850, 900, 1000, 1100],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        return () => {
            if (salesChartInstance.current) salesChartInstance.current.destroy();
            if (ordersChartInstance.current) ordersChartInstance.current.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white py-4 px-6 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">E-Commerce Dashboard</h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
                        <p className="text-3xl font-bold text-green-600">$250,000</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Products Sold</h3>
                        <p className="text-3xl font-bold text-blue-600">12,345</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Active Users</h3>
                        <p className="text-3xl font-bold text-yellow-600">8,000</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">Pending Orders</h3>
                        <p className="text-3xl font-bold text-red-600">1,200</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sales Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
                        <div className="relative h-72">
                            <canvas ref={salesChartRef}></canvas>
                        </div>
                    </div>
                    {/* Orders Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Orders Overview</h2>
                        <div className="relative h-72">
                            <canvas ref={ordersChartRef}></canvas>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b p-4">Order ID</th>
                                <th className="border-b p-4">Customer</th>
                                <th className="border-b p-4">Date</th>
                                <th className="border-b p-4">Total</th>
                                <th className="border-b p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-b p-4">#10001</td>
                                <td className="border-b p-4">Alice</td>
                                <td className="border-b p-4">2025-01-10</td>
                                <td className="border-b p-4">$120.00</td>
                                <td className="border-b p-4 text-green-600">Completed</td>
                            </tr>
                            <tr>
                                <td className="border-b p-4">#10002</td>
                                <td className="border-b p-4">Bob</td>
                                <td className="border-b p-4">2025-01-11</td>
                                <td className="border-b p-4">$220.00</td>
                                <td className="border-b p-4 text-yellow-600">Pending</td>
                            </tr>
                            <tr>
                                <td className="border-b p-4">#10003</td>
                                <td className="border-b p-4">Charlie</td>
                                <td className="border-b p-4">2025-01-12</td>
                                <td className="border-b p-4">$90.00</td>
                                <td className="border-b p-4 text-red-600">Cancelled</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}
            </div>
        </div>
    );
};

export default AdminDashboard;
