import {useBlockProps, RichText} from '@wordpress/block-editor';

export default function save({attributes}) {
	return (
		<div {...useBlockProps.save()}>
			<div id="liber-calendar">

				<div className="grid grid-cols-5">
					<RichText.Content className="col-span-2 p-4"
									  tagName="div"
									  value={attributes.description}
					/>

					<div className="col-span-3">

						<div className="flex flex-row">
							<div id="liber-calendar-prev-button">

							</div>

							<div id="liber-calendar-month" className="flex-grow text-center"></div>
							<div id="liber-calendar-next-button">

							</div>
						</div>

						<div className="grid grid-cols-7 " id="liber-calendar-day-name">
							<div>MO</div>
							<div>DI</div>
							<div>MI</div>
							<div>DO</div>
							<div>FR</div>
							<div>SA</div>
							<div>SO</div>
						</div>

						<div className="grid grid-cols-7 gap-1" id="liber-calendar-content">
						</div>
					</div>
				</div>

				<div id="liber-calendar-selected-show" className="col-span-2">
				</div>

			</div>
		</div>
	);
}
