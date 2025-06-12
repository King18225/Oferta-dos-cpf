
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('[API /api/userData] Request received');
  const searchParams = request.nextUrl.searchParams;
  const cpf = searchParams.get('cpf');

  if (!cpf) {
    console.log('[API /api/userData] CPF is required, returning 400');
    return NextResponse.json({ error: 'CPF is required' }, { status: 400 });
  }

  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) {
    console.log(`[API /api/userData] Invalid CPF format for external API query: ${cleanCPF}, returning 400`);
    return NextResponse.json({ error: 'Invalid CPF format for external API query' }, { status: 400 });
  }
  
  const externalApiUrl = `https://proxy-a.vercel.app/api/proxy?cpf=${cleanCPF}`;
  let externalApiResponse; // To hold the response object for logging in case of error

  try {
    externalApiResponse = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const responseText = await externalApiResponse.text(); // Read body as text first

    if (!externalApiResponse.ok) {
      console.error(`[API /api/userData] External API error: Status ${externalApiResponse.status}, URL: ${externalApiUrl}, Body: ${responseText.substring(0, 500)}...`);
      return NextResponse.json({ error: `External API failed with status ${externalApiResponse.status}`, details: responseText }, { status: externalApiResponse.status });
    }

    try {
      const data = JSON.parse(responseText); // Attempt to parse the text as JSON
      console.log('[API /api/userData] Successfully fetched and parsed data. Sending response.');
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error(`[API /api/userData] Failed to parse JSON response from external API (Status: ${externalApiResponse.status}, URL: ${externalApiUrl})`, jsonError);
      console.error(`[API /api/userData] Raw response body (on JSON parse failure): ${responseText.substring(0, 500)}...`);
      return NextResponse.json({ error: 'Invalid JSON response from external source', details: 'The data received was not in the expected format.' }, { status: 502 }); // 502 Bad Gateway
    }

  } catch (error) {
    console.error('[API /api/userData] General error in GET handler:', externalApiUrl, error);
    if (externalApiResponse) {
      console.error(`[API /api/userData] Error occurred with external response status: ${externalApiResponse.status} ${externalApiResponse.statusText}`);
    }
    let errorMessage = 'Internal server error fetching data';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to fetch data from external source', details: errorMessage }, { status: 500 });
  }
}
