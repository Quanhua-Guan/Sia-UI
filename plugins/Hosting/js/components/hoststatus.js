import React, { PropTypes } from 'react'

const HostStatus = ({hasCheckedConnectability, connectable, working}) => {
	if (!hasCheckedConnectability) {
		return (
			<div className="host-status">
				<i className="fa fa-refresh inactive-icon" />
				<span> Checking Host Status... </span>
				<div className="host-status-info">
					Sia-UI is determining the status of your Host.
				</div>
			</div>
		)
	}

	if (!connectable) {
		return (
			<div className="host-status">
				<i className="fa fa-times offline-icon" />
				<span> Host Unreachable </span>
				<div className="host-status-info">
					Your host is not connectable at the configured net address. Check your UPNP or NAT settings.
				</div>
			</div>
		)
	}

	if (connectable && !working) {
		return (
			<div className="host-status">
				<i className="fa fa-times inactive-icon" />
				<span> Host Inactive </span>
				<div className="host-status-info">
					Your host is connectable, but it is not being used by any renters.
				</div>
			</div>
		)
	}

	return (
		<div className="host-status">
			<i className="fa fa-check online-icon" />
			<span> Host Online </span>
			<div className="host-status-info">
				Your host is connectable and is being contacted by renters.
			</div>
		</div>
	)
}

HostStatus.propTypes = {
	connectable: PropTypes.bool.isRequired,
	working: PropTypes.bool.isRequired,
	hasCheckedConnectability: PropTypes.bool.isRequired,
}

export default HostStatus

