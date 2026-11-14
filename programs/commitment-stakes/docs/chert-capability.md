# Bounded Chert capability check

Checked 14 November 2026. **Result: BLOCKED** for an end-to-end demonstration of
raw caller camera frames at approximately 15+ fps. No received frames, timestamps,
measured fps or rep counts are claimed.

Bound: inspect connected tooling and published primary documentation; do not
provision paid services, place calls, collect recordings or acquire secrets.
No Chert tool/session is exposed in the current connection inventory. No
authorized active call, caller consent/session, or LiveKit room is available for
a receiver benchmark. Missing Chert access does not block Anchor source work.

Evidence:

- [Chert SDK 0.2.3 documentation](https://pypi.org/project/chert-sdk/0.2.3/)
  describes raw-frame copying but marks custom media sessions as source preview,
  with hosted routes unavailable. Buffer validation is not caller-frame access.
- [Official open-source connector guide](https://github.com/cherthq/chert-facetime-opensource/blob/main/docs/GUIDE.md)
  describes caller audio and agent video, a separately operated LiveKit agent,
  manual iPhone admission, and testing on macOS. It does not establish raw caller
  video delivery to a CV worker at 15+ fps on this Windows environment.

Hosted custom-media route path: documented unsupported in the inspected SDK
release. Overall requested live CV capability: blocked, rather than a conclusion
that every possible Chert/LiveKit integration is unsupported.

To resolve: with an authorized consenting test call on a supported host, subscribe
to the caller CAMERA track through a supported API, decode frames privately, and
measure unique increasing timestamps for at least 30 seconds. Report effective
fps, resolution, gaps/drops and end-to-end latency; require sustained >=15 fps,
not an advertised frame-rate maximum or repeated screenshots. Do not use screen
share limits as camera throughput evidence. Stop if access is absent or costs
would be incurred; continue independent Anchor work. Delete test media promptly.

MediaPipe would remain a separate verifier; Chert is transport, not proof of
exercise, identity or liveness. Offline clip verification remains a separate
possible capture path pending the MVP and app implementation decision.
