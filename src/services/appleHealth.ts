export class AppleHealthService {
  private authorized = false;

  isAvailable(): boolean {
    return 'webkit' in window;
  }

  async initialize(): Promise<boolean> {
    this.authorized = true;
    return true;
  }

  async isAuthorized(): Promise<boolean> {
    return this.authorized;
  }

  async getLatestWorkouts(limit: number): Promise<any[]> {
    if (!this.authorized) {
      throw new Error('Not authorized to access Apple Health');
    }
    return [];
  }
}