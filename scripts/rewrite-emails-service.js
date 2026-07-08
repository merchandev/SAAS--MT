import fs from 'fs';
import path from 'path';

const filepath = 'c:/Users/merch/OneDrive/Escritorio/mt220626/PROYECTO METRANSFERS/proyecto-migra/modules/notifications/emails.service.ts';
let content = fs.readFileSync(filepath, 'utf8');

// I will write a custom regex for sendBookingCancelled, sendBookingRefunded, sendTripStarted, sendTripCompleted, sendReviewRequested, sendAdminNewBookingAlert
// Actually, using regex for such complex replacements is brittle. I'll just use manual replace for them using replace_file_content in sequence.
