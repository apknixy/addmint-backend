        <p>Thank you,<br>The AddMint Team</p>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      functions.logger.info(`Withdrawal email sent for request ${requestId}.`);
      // Update the request document status in Firestore
      await snap.ref.update({ emailStatus: 'sent' });
    } catch (error) {
      functions.logger.error(`Error sending withdrawal email for request ${requestId}:`, error);
      // Update the request document status to 'error'
      await snap.ref.update({ emailStatus: 'error', errorMessage: error.message });
    }
  });

/**
 * Cloud Function to clean up expired posts (e.g., after 24 hours).
 * This is a scheduled function that runs periodically.
 * You can adjust the schedule (e.g., 'every 1 hour', 'every 30 minutes').
 * To deploy, you need to be in the 'functions' directory and run 'firebase deploy --only functions'.
 */
// exports.cleanupExpiredPosts = functions.pubsub.schedule('every 12 hours').onRun(async (context) => {
//   const now = admin.firestore.Timestamp.now();
//   functions.logger.info(`Starting cleanup for expired posts at ${now.toDate().toLocaleString()}`);

//   try {
//     const expiredPostsSnapshot = await db.collection('posts')
//       .where('expiryTime', '<=', now)
//       .get();

//     if (expiredPostsSnapshot.empty) {
//       functions.logger.info('No expired posts found.');
//       return null;
//     }

//     const batch = db.batch();
//     let deletedCount = 0;

//     for (const postDoc of expiredPostsSnapshot.docs) {
//       batch.delete(postDoc.ref); // Delete the post document

//       // Also delete comments subcollection for this post
//       const commentsSnapshot = await postDoc.ref.collection('comments').get();
//       commentsSnapshot.docs.forEach(commentDoc => {
//         batch.delete(commentDoc.ref);
//       });

//       // Decrement the user's postCount
//       const userId = postDoc.data().userId;
//       if (userId) {
//         const userRef = db.collection('users').doc(userId);
//         batch.update(userRef, {
//           postCount: admin.firestore.FieldValue.increment(-1)
//         });
//       }
//       deletedCount++;
//     }

//     await batch.commit();
//     functions.logger.info(`Successfully deleted ${deletedCount} expired posts and their associated comments.`);
//     return null;

//   } catch (error) {
//     functions.logger.error(`Error during expired post cleanup:`, error);
//     return null;
//   }
// });
