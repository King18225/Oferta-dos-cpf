
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cpf = searchParams.get('cpf');

  if (!cpf) {
    return NextResponse.json({ error: 'CPF is required' }, { status: 400 });
  }

  const cleanCPF = cpf.replace(/\D/g, '');
  // Ensure the external API URL is correctly formed
  if (cleanCPF.length !== 11) {
    return NextResponse.json({ error: 'Invalid CPF format for external API query' }, { status: 400 });
  }
  
  const externalApiUrl = `https://proxy-a.vercel.app/api/proxy?cpf=${cleanCPF}`;

  try {
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        // Add any necessary headers if the external API requires them.
        // For example, some APIs require an 'Accept' header.
        'Accept': 'application/json',
      },
      // It's good practice to set a timeout for external API calls if possible,
      // though `fetch` in Node doesn't have a built-in timeout option like in browsers.
      // For more robust timeout handling, you might use AbortController or a library like 'node-fetch' with timeout options.
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => 'Failed to read error response from external API');
      console.error(`External API error: Status ${response.status}, URL: ${externalApiUrl}, Body: ${errorData}`);
      return NextResponse.json({ error: `External API failed with status ${response.status}`, details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from external API:', externalApiUrl, error);
    let errorMessage = 'Internal server error fetching data';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // It's often useful to log the type of error as well
    // console.error('Error type:', error?.constructor?.name);
    return NextResponse.json({ error: 'Failed to fetch data from external source', details: errorMessage }, { status: 500 });
  }
}
