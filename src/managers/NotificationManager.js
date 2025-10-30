import NotificationService from '../services/NotificationService';

class NotificationManager {
  constructor() {
    this.lastNotificationTime = {};
    this.notificationCooldown = 60000; // 1 minute between same type notifications
  }

  shouldSendNotification(type) {
    const now = Date.now();
    const lastTime = this.lastNotificationTime[type] || 0;

    if (now - lastTime < this.notificationCooldown) return false;

    this.lastNotificationTime[type] = now;
    return true;
  }

  async notifyBusNearby(busNumber, distance) {
    if (!this.shouldSendNotification('nearby')) return;

    await NotificationService.sendLocalNotification(
      '🚌 Bus Approaching!',
      `Bus ${busNumber} is ${distance.toFixed(1)} km away.`,
      { type: 'bus_nearby', busNumber, distance }
    );
  }

  async notifyBusVeryClose(busNumber, eta) {
    if (!this.shouldSendNotification('very_close')) return;

    await NotificationService.sendLocalNotification(
      '⚠️ Bus Almost Here!',
      `Bus ${busNumber} arriving in ~${eta} minutes. Get ready!`,
      { type: 'bus_arriving', busNumber, eta }
    );
  }

  async notifyTripStarted(busNumber, routeName) {
    await NotificationService.sendLocalNotification(
      '🟢 Trip Started',
      `Driver started the trip for ${routeName}. Bus ${busNumber} is on the way!`,
      { type: 'trip_started', busNumber, routeName }
    );
  }

  async notifyTripEnded(busNumber) {
    await NotificationService.sendLocalNotification(
      '🔴 Trip Ended',
      `Bus ${busNumber} has completed the trip.`,
      { type: 'trip_ended', busNumber }
    );
  }

  async notifyDelay(busNumber, reason) {
    await NotificationService.sendLocalNotification(
      '⏰ Delay Alert',
      `Bus ${busNumber} is delayed. Reason: ${reason}`,
      { type: 'delay', busNumber, reason }
    );
  }

  async notifyRouteChange(busNumber, newRoute) {
    await NotificationService.sendLocalNotification(
      '🔄 Route Changed',
      `Bus ${busNumber} route changed to ${newRoute}`,
      { type: 'route_change', busNumber, newRoute }
    );
  }

  async scheduleDailyReminder(seconds) {
    await NotificationService.scheduleNotification(
      '📅 Bus Reminder',
      'Don’t forget to check your bus timing!',
      seconds,
      { type: 'daily_reminder' }
    );
  }
}

export default new NotificationManager();
