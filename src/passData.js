

let savedHostesses=[];

/**
 * Select hostesses to speak to
 */
export function HandleConfirmHostesses({hostesses}){
    if (hostesses == null){
        throw new Error("Hostesses list cannot be null");
    }

    if (hostesses.length == 0){
        console.log("Hostess list is empty");
    }

    Object.values(hostesses).forEach(h =>
        {if (h == null){
            throw new Error("Hostesses list cannot be null");
        }
            console.log("Adding hostess");
            savedHostesses.push(h);
        }
    );
}

/**
 * Clears all hostesses
 */
export default function HandleClearHostesses({hostesses}){
    console.log("Clear Hostesses called");
    savedHostesses = [];
}

// export { handleConfirmHostesses };


