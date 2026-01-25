async function getTickets(){
    const res = await fetch(`/api/tickets`, {
        cache : "no-store",
    });

    if(!res.ok){
        throw new Error("Failed to fetch tickets"); 
    }

    return res.json();
}

export default async function TicketsPage() {
    const data = await getTickets();

    return(
        <div style={{padding : "2rem"}}>
            <h1>Tickets</h1>
            {data.tickets.length === 0 && <p>No tickets found</p>}

            <ul>{data.tickets.map((ticket: any)=> (
                <li key = {ticket.id} style={{marginBottom : "1rem"}}>
                    <strong>{ticket.title}</strong>
                    <div>Priority: {ticket.priority}</div>
                    <div>Status: {ticket.status}</div>
                    <div>
                        SLA Remaining: {" "}
                        {Math.max(0, Math.floor(ticket.sla.remainingMs / 60000))} minutes
                    </div>
                    <div>
                        Breached: {ticket.sla.isBreached ? "Yes" : "No"}
                    </div>
                    </li>
            ))}
            </ul>
        </div>
    );
}