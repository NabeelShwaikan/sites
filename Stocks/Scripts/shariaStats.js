function updateStats(){
  const stats = window.ShariaDataService.getStatistics();
  document.getElementById('total').textContent = stats.total;
  document.getElementById('c3').textContent = stats.byApprovalCount[3] || 0;
  document.getElementById('c2').textContent = stats.byApprovalCount[2] || 0;
  document.getElementById('c1').textContent = stats.byApprovalCount[1] || 0;
  document.getElementById('c0').textContent = stats.byApprovalCount[0] || 0;
}
