const { execSync } = require('child_process');

function killPort(port) {
  try {
    console.log(`Checking port ${port}...`);
    let output = '';
    try {
      // netstat -ano lists all connections and listening ports with PIDs
      // findstr :[port] filters lines matching the port
      output = execSync(`netstat -ano | findstr :${port}`).toString();
    } catch (err) {
      // findstr exits with code 1 when no matches are found
      console.log(`Port ${port} is not in use.`);
      return;
    }

    const lines = output.split('\n');
    const pids = new Set();
    
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const localAddress = parts[1];
        // Ensure it matches specifically the port, e.g. ending in :3000 or :3001
        if (localAddress && (localAddress.endsWith(`:${port}`) || localAddress.endsWith(`]${port}`) || localAddress.endsWith(`:${port}\r`) || localAddress.includes(`:${port}`))) {
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid) && pid !== '0') {
            pids.add(parseInt(pid, 10));
          }
        }
      }
    }
    
    for (const pid of pids) {
      if (pid === process.pid) {
        console.log(`Port ${port} is used by the current script process (${pid}), skipping.`);
        continue;
      }
      console.log(`Killing process ${pid} on port ${port}...`);
      try {
        execSync(`taskkill /F /PID ${pid}`);
        console.log(`Successfully killed process ${pid}`);
      } catch (err) {
        console.error(`Failed to kill process ${pid}:`, err.message);
      }
    }
  } catch (error) {
    console.error(`Error checking/killing port ${port}:`, error.message);
  }
}

killPort(3000);
killPort(3001);
