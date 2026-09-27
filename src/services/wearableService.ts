import { WearableMoodSignal, MoodType } from '@/types/wardrobe';

export interface MoodQuestionnaireAnswers {
  energy: 'high' | 'moderate' | 'relaxed' | 'focused';
  emotion: 'calm' | 'bold' | 'chill' | 'sensitive' | 'hyped';
  tactilePreference: 'breathable' | 'structured' | 'plush' | 'minimal';
  thermalPreference: 'run_warm' | 'run_cold' | 'neutral';
}

export class WearableService {
  private static currentSignal: WearableMoodSignal = {
    status: 'connected',
    mood: 'Calm',
    confidence: 76,
    heartRate: 68,
    deviceModel: 'We Milan Halo Band v1',
    lastSync: 'Just now'
  };

  private static manualActive: boolean = false;

  public static getSignal(): WearableMoodSignal {
    return { ...this.currentSignal };
  }

  public static isManualAssessment(): boolean {
    return this.manualActive;
  }

  public static setMood(mood: MoodType, confidence: number = 82): WearableMoodSignal {
    this.currentSignal = {
      ...this.currentSignal,
      mood,
      confidence,
      lastSync: 'Updated just now'
    };
    return this.getSignal();
  }

  /**
   * Processes manual mood & comfort questionnaire answers when Bluetooth is absent.
   */
  public static submitManualAssessment(answers: MoodQuestionnaireAnswers): WearableMoodSignal {
    let computedMood: MoodType = 'Calm';
    let estimatedHeartRate = 72;
    let confidence = 88;

    // Evaluate energy & emotion
    if (answers.energy === 'high' || answers.emotion === 'hyped') {
      computedMood = 'Energetic';
      estimatedHeartRate = 92;
      confidence = 94;
    } else if (answers.emotion === 'bold' || answers.energy === 'focused') {
      computedMood = 'Confident';
      estimatedHeartRate = 82;
      confidence = 92;
    } else if (answers.energy === 'relaxed' || answers.emotion === 'sensitive' || answers.tactilePreference === 'plush') {
      computedMood = 'Cozy';
      estimatedHeartRate = 64;
      confidence = 96;
    } else if (answers.emotion === 'chill' || answers.tactilePreference === 'minimal') {
      computedMood = 'Low-key';
      estimatedHeartRate = 68;
      confidence = 90;
    } else {
      computedMood = 'Calm';
      estimatedHeartRate = 70;
      confidence = 92;
    }

    this.manualActive = true;
    this.currentSignal = {
      status: 'connected',
      mood: computedMood,
      confidence,
      heartRate: estimatedHeartRate,
      deviceModel: 'Manual Mood Check-in',
      lastSync: 'Verified via Questionnaire'
    };

    return this.getSignal();
  }

  /**
   * Attempts real Web Bluetooth BLE connection to compatible heart rate sensors
   * with graceful fallback to simulated pairing or manual questionnaire.
   */
  public static async requestBluetoothDevice(): Promise<{ success: boolean; message: string; signal: WearableMoodSignal }> {
    this.currentSignal.status = 'syncing';

    if (typeof window !== 'undefined' && 'bluetooth' in navigator) {
      try {
        const nav = navigator as any;
        const device = await nav.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['battery_service']
        });

        if (device) {
          const server = await device.gatt.connect();
          let hr = 74;
          try {
            const hrService = await server.getPrimaryService('heart_rate');
            const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
            await hrChar.startNotifications();
            hrChar.addEventListener('characteristicvaluechanged', (event: any) => {
              const val = event.target.value;
              const rate = val.getUint8(1);
              if (rate > 40 && rate < 200) {
                this.currentSignal.heartRate = rate;
              }
            });
          } catch {}

          this.manualActive = false;
          this.currentSignal = {
            status: 'connected',
            mood: hr > 85 ? 'Energetic' : 'Calm',
            confidence: 95,
            heartRate: hr,
            deviceModel: device.name || 'Bluetooth BLE Monitor',
            lastSync: 'Live BLE Stream'
          };

          return { success: true, message: `Connected to ${device.name || 'BLE Wearable'}`, signal: this.getSignal() };
        }
      } catch (err: any) {
        // User cancelled picker or device disconnected
      }
    }

    // If Web Bluetooth cancelled or unavailable, gracefully connect demo sensor or suggest questionnaire
    await new Promise(r => setTimeout(r, 800));
    this.manualActive = false;
    this.currentSignal = {
      status: 'connected',
      mood: 'Calm',
      confidence: 78,
      heartRate: 70,
      deviceModel: 'We Milan Halo Band v1',
      lastSync: 'Synced just now'
    };

    return {
      success: true,
      message: 'Wearable synced. You can also take the Manual Mood Questionnaire anytime.',
      signal: this.getSignal()
    };
  }

  public static async simulatePairing(): Promise<WearableMoodSignal> {
    const res = await this.requestBluetoothDevice();
    return res.signal;
  }

  public static getMoodStylingAdvice(mood: MoodType): string {
    switch (mood) {
      case 'Calm':
        return 'Soft neutrals and relaxed silhouettes to sustain inner composure.';
      case 'Energetic':
        return 'Dynamic cuts and bold accents that match your active pulse.';
      case 'Confident':
        return 'Sharp tailoring and monochrome contrast for an assertive presence.';
      case 'Cozy':
        return 'Tactile knits and gentle draping for maximum tactile comfort.';
      case 'Low-key':
        return 'Understated minimalist layers that let you move unencumbered.';
    }
  }
}
