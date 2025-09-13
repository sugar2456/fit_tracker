import { NextRequest, NextResponse } from 'next/server';
import { FileActivityDataRepository } from '../../../repository/file';
import { ActivityDataService } from '../../../services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const source = searchParams.get('source');
    const activityId = searchParams.get('activityId');

    const repository = new FileActivityDataRepository();
    const service = new ActivityDataService(repository);

    switch (action) {
      case 'sources':
        const availableSources = await service.getAvailableDataSources();
        return NextResponse.json({ sources: availableSources });

      case 'summary':
        if (!source) {
          return NextResponse.json({ error: 'Source parameter required' }, { status: 400 });
        }
        const summary = await service.getActivitySummary(source);
        return NextResponse.json(summary);

      case 'trackpoints':
        if (!source || !activityId) {
          return NextResponse.json({ error: 'Source and activityId parameters required' }, { status: 400 });
        }
        const trackpoints = await service.getTrackpointsForActivity(source, activityId);
        return NextResponse.json({ trackpoints });

      default:
        return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}